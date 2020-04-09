# O R B I T A L - F R A M E
`@orbital-frame/core` is a framework for building chatbots that work similarly
to the UNIX command line, complete with commands, pipes, variables, signals,
etc. A reference implementation is provided in `@orbital-frame/jehuty`.

## Creating a bot
```js
import orbitalFrame from '@orbital-frame/core'
import hubotAdapter from '@orbital-frame/adapter-hubot' // you must include an adapter for your chat platform. See documentation below for creating your own adapters
import commands from './commands' // these are commands that you define
import plugins from './plugins' // these are plugins that you define
import hubotConfig from './config' // your adapter configuration

const jehuty = hubot => orbitalFrame(hubotAdapter(hubot, hubotConfig), {
  name: 'jehuty', // name that the bot will respond to. For instance `@jehuty echo "hi"`
  commands,
  plugins
})

export default hubot => jehuty(hubot).run() // where your framework instance comes from will vary depending on your chat platform but hubot passes this in as `robot` to every script in the `scripts` directory
```

### Options
  * **name** `String [default: "orbital-frame"]` The name of the bot. This is used to match user input to trigger the bot's listener.
  * **ps2** `String [default: ">"]` This is the string or character that the bot uses to send input to interactive commands.
  * **commands** `Array<Command> [default: []]` Commands that are available to run (see COMMANDS below for documentation on creating your own commands).
  * **plugins** `Array<Plugin> [default: []]` Loaded plugins (see PLUGINS below for documentation on creating your own plugins).
  * **rootUsers** `Array<Number> [default: []]` User IDs for users who are root. Root users have de facto, unrevokable superuser powers and may promote other users to superuser as well.
  * **storageEngine** `StorageEngine [default: MemoryEngine]` Key/value storage used by the `persistenceService`. By default, the MemoryEngine is used which does not persist data between restarts. For an example of creating your own storage engine, look at the [source for the Memory Engine](./src/memoryEngine.js).

## Adapters
Orbital Frame uses adapters to gain functionality for interacting with various
chat services. Currently, only the Hubot (`@orbital-frame/adapter-hubot`) adapter is available and this is what
`@orbital-frame/jehuty` runs on.

### Creating adapters
`TODO` The adapters API is still in flux

See the [hubot adapter](../orbital-frame-adapter-hubot/src/index.js) as an example.

## Runtime
The Orbital Frame lifecycle consists of the following stages:
  - **loadPlugins** loads plugins into the Orbital Frame lifecycle
  - **loadCommands** loads commands into the Orbital Frame lifecycle
  - **listen** sets up a responder for every time this bot is mentioned.
      *NOTE*: the exit phase triggers when the responder has been triggered, not when the
      responder has been set up
  - **process** processes a message produced from the bot's invocation
  - **execute** executes a command built from the message
  - **respond** returns the command's output

## Services
Orbital Frame uses dependency injection (DI) to expose its various configured
subsystems for use within the lifecycle and user-defined commands and plugins.

### channelService
The channel service retrieves channels from the chat service the bot is running
on.
  * **`async list`** `-> Array<Channel>` Get all channels
  * **`async find`** `Object searchCriteria -> Array<channel>` Find channels matching the given criteria
  * **`async findOne`** `Object searchCriteria -> channel [throws Error on no channel found]` Returns the first channel matching the given criteria

#### Example
```js
const example = async ({ channelService }) => {
  const allChannels = await channelService.list()
  const channel123 = await channelService.findOne({ id: 123 })
}
```

### commandService
The command service enables the loading of commands into the bot.
  * **`get registry`** `-> Array<Command>` Get all loaded commands
  * **`load`** `Array<Commands> | Command -> Nil` load a command

#### Example
```js
import sampleCommand from './sample'
const example = ({ commandService }) => {
  const loadedCommands = commandService.registry
  commandService.load(sampleCommand)
}
```

### compilerService
The compiler service takes a source string and produces an executable command.
  * **`compile`** `String source -> Fn`
  * **`compileWithMetadata`** `String source -> { metadata: Object, command: Fn }` Build an executable command and metadata describing the command from a source string

#### Example
```js
const example = ({ compilerService }) => {
  const source = 'VAR=test; echo $VAR | transform-text --uppercase'
  const command = compilerService.compile(source)
  const { metadata } = compilerService.compileWithMetadata(source)

  const output = command()
  metadata.pipelines[0].commands[0].name // "echo"
}
```

### configService
The config service holds configuration information for the bot:**
  * **`name`** `-> String` The name of the bot
  * **`ps1`** `-> String` The leading character that must be placed before the bot's name to trigger a response (for slack this is `@`)
  * **`ps2`** `-> String` The leading character that must be input before a subshell command to trigger a response. This is used for interactive commands using the interaction service
  * **`commands`** `-> Array<Command>` A list of commands registered with the bot
  * **`plugins`** `-> Array<Plugin>` A list of plugins registered with the bot
  * **`adapter`** `-> Adapter` The adapter the bot is running on. Note that using the adapter
    directly will couple your command/plugin to the adapter itself so all
    dependencies on the adapter itself pass through an abstraction layer in the
    core itself.

#### Example
```js
const example = ({ configService }) => {
  const { name, commands, plugins, adapter } = configService
}
```

### environmentService
The environment service is used to store and retrieve variables.
  * **`set`** `String, Any -> Nil` Assign a value to a variable in the environment
  * **`get`** `String -> Any` Retrieve a value for a variable in the environment

#### Example
```js
const example = ({ environmentService, compilerService }) => {
  environmentService.set('TEST_VAR', 'hello')
  const value = environmentService.get('TEST_VAR')

  const command = compilerService.compile('echo $TEST_VAR')
  command() // This will echo "hello" as set in the environment
}
```

### interactionService
The interaction service is used to make interactive commands, such as commands
that prompt the user or start up an embedded shell to run its own commands.
**MESSAGES INTERCEPTED BY `prompt` MUST START WITH WHATEVER YOUR `ps2` IS SET TO
IN YOUR CONFIGURATION (`>` by default) IN ORDER TO DISTINGUISH SUBCOMMANDS FROM
NON-ORBITAL FRAME INPUT**
  * **`createInteractionChannel`** `Array<Users> = []` Create a channel for interacting with a group of users (the user which created the channel belongs to the group)
    * **`prompt`** `String message -> Promise<Message>` Prompt the user for input
    * **`observe`** `Nil -> Stream` Create an interaction listener stream
    * **`send`** `String message` Send text to the user
  * **`foreground`** `Number userId, Number jobId -> Nil` Foreground a backgrounded interaction

#### Example
```js
// For more on commands see "Commands" below
const interactiveCommand = ({ interactionService }) => ({
  name: 'test-interactive',
  description: 'Test interactive commands',
  format ({ name, age }) {
    return `Name: ${name}, Age: ${age}`
  },
  async execute () {
    const interaction = await interactionService.createInteractionChannel()

    const { text: name } = await interaction.prompt('What is your name?')
    const { text: age } = await interaction.prompt('What is your age?')

    return { name, age }
  }
})
```

### jobService
The job service associates commands with users and provides operations for
retrieving information for jobs.
  * **`subscribe`** `Number jobId, Fn callback -> Subscription` attach an update listener to a job. Whenever the job with ID jobId is updated, your callback will be invoked with the updated job. Returns an object with an `unsubscribe` function for removing your callback
  * **`async list`** `-> Array<Job>` Get all jobs
  * **`async find`** `Object searchCriteria -> Array<Job>` Find jobs matching the given criteria
  * **`async findOne`** `Object searchCriteria -> Job [throws Error on no job found]` Returns the first job matching the given criteria

#### Example
```js
const example = async ({ jobService, userService }) => {
  const user = await userService.find({ name: 'konapun' })
  const runningJobs = await jobService.find({ user, status: 'running' })
  const finishedJobs = await jobService.find({ user, status: 'finished' })
  const returnValues = await finishedJobs.map(job => job.returnValue)

  const subscription = jobService.subscribe(runningJobs[0].id, updated => {
    console.log('Job was updated:', updated)
  })

  subscription.unsubscribe()
}
```

### listenerService
The listener service sets up a matcher with an action.
  * **`listen`** `String -> StreamReader` Set up a listener and receive a stream reader to get responses written to the stream

#### Example
```js
const example = ({ listenerService }) => {
  listenerService.listen('hey')
    .pipe(message => {
      console.log('Received message')
    })
}
```
### messengerService
The messenger service sends output to the adapter the bot is running on.
  * **`respond`** `Context, String -> Nil` Send a message in response to the sending context
  * **`send`** `Channel, String -> Nil` Send a message to a channel
  * **`reply`** `Context, String` Reply to a sending context

#### Example
```js
import {phase} from '@orbital-frame/core'

const examplePlugin = ({ messengerService }) => {
  [phase.EXECUTE]: {
    error (err, { context }) {
      messengerService.respond(context, `Error: ${err.message}`)
    }
  }
}
```

### permissionService
The permission service allows promoting/demoting users to/from superuser and
guarding blocks of code which require superuser permission.
  * **`async promote`** `Number userId -> Bool` Promote a user to a superuser. Only a superuser can promote a user.
  * **`async demote`** `Number userId -> Bool` Demote a user to a normal user. Only a superuser can demote a uer.
  * **`isSuperuser`** `Number userId -> Bool` Returns whether or not a user is a superuser.
  * **`async guard`** `Fn block -> Any` Only run `block` if the user associated with the currently executing job is a superuser.

#### Example
```js
export const example = ({ permissionService }) => ({
  name: 'example',
  async execute () {
    permissionService.guard(() => {
      return 'this output is only available to superusers'
    })
  }
})
```
```js
export const promote = ({ permissionService }) => ({
  name: 'promote',
  async execute ([ userId ]) {
    permissionService.promote(userId)
  }
})
```

### persistenceService
The persistence service retains data between restarts. Some services, like the
permissionService, utilize the persistenceService to persist superuser status.
  * **async get** `String key -> Any` Get data stored at `key`.
  * **async set** `String key, Any value -> Nil` Set value for key `key` to `value`.
  * **curry** `String key -> CurryApi` Set a key to be used with all subsequent get/set calls from the CurryApi below:
    * **async get** `Nil -> Any` Set data stored at the key used as the argument to `curry`.
    * **async set** `Any value -> Nil` Set the value for `key` used as the argument to `curry` to `value`.
  * **namespace** `String namespace -> NamespaceApi` Set a namespace to automatically use for each key in the following API:
    * **async get** `String key -> Any` Get data stored at namespaced `key`. This is equivalent to doing a `get` from the main API with your key `${namespace}.${key}`.
    * **async set** `String key, Any value -> Nil` Set value for namespaced key `key` to value `value`. This is equivalent to doing a `set` from the main API with your key `${namespace}.${key}`.
    * **curry** `String key -> CurryApi` Like `curry` from the main API but the key is updated to use the namespace value. This is equivalent to doing a `curry` from the main API with your key `${namespace}.${key}`
      * **async get** `Nil -> Any` Set data stored at the key used as the argument to `curry` where the key is the namespaced key.
      * **async set** `Any value -> Nil` Set the value for `key` used as the argument to `curry` to `value` where the key is the namespaced key.
#### Example
```js
export const example = ({ persistenceService }) => ({
  name: 'persistence-example',
  async execute (key, value) {
    const ns = 'orbital-frame.command.persistence-example'
    const db = persistenceService.namespace(ns).curry(key)

    if (value) {
      db.set(value)
    } else {
      db.get()
    }
  }
})
```

### pluginService
The plugin service is responsible for registering plugins.
(See below for documentation on creating your own plugins)
  * **`load`** `Plugin | Array<Plugin> -> Nil` Load one or more plugins

#### Example
```js
import myPlugin from './my-plugin'
const example = ({ pluginService }) => {
  pluginService.load(myPlugin)
}
```

### signalService
The signal service allows commands to specify signal handlers and allows other
commands to send signals to running jobs. Unlike real UNIX, orbital-frame does
not have access to allocated resources like file handles or anything else that
may need to be destroyed upon SIGKILL so signals can only be sent to "friendly"
jobs that manually specify their own signal handlers. Attempts to send a signal
to a job that doesn't handle that signal will result in a catchable error being
thrown.
  * **`createSignalHandler`** `Nil` Create a signal handler for a process which will respond to signals sent by other commands.
    * **`onSignal`** `Signal signal, Fn handler` Set up a function to be invoked upon signal.
  * **`send`** `Number jobId, Signal signal` Send a signal to a job which has a signal handler installed. Throws an error if job cannot receive signal.

#### Available Signals
  * **SIGINT** (signal number 1) - analogous to SIGINT in UNIX; a command implementing a handler for this signal should cleanup and halt immediately if possible
  * **SIGSTP** (signal number 2) - analogous to SIGSTP in UNIX; a command implementing a handler for this signal should pause and allow itself to be resumed by SIGRES
  * **SIGRES** (signal number 3) - (no UNIX analog); a command implementing a handler for this signal should resume if paused by SIGSTP

#### Example
##### Handler
```js
const example = ({ interactionService, signalService }) => ({
  name: 'observer',
  description: 'Testing observable interactions',
  async execute () {
    const interaction = await interactionService.createInteractionChannel()
    const signalHandler = await signalService.createSignalHandler()
    const stream = interaction.observe()

  let paused = false
    return new Promise(resolve => {
      signalHandler.onSignal(signalService.signal.SIGSTP, () => {
        paused = true
      })
      signalHandler.onSignal(signalService.signal.SIGRES, () => {
        paused = false
      })
      signalHandler.onSignal(signalService.signal.SIGINT, () => {
        stream.end()
        resolve('Caught signal SIGINT; exiting')
      })

      stream.pipe(({ user, text }) => {
        if (text === 'exit') {
          resolve('Exiting')
          stream.end()
        } else if (!paused) {
          interaction.send(`User ${user.name} sent message: ${text}`)
        }
      })
    })
  }
})

```

##### Sender
```js
export default ({ signalService }) => ({
  name: 'kill',
  description: 'Send a signal to a job',
  options: {
    1: {
      alias: 'SIGINT',
      type: 'boolean',
      description: 'Request a job to interrupt'
    },
    2: {
      alias: 'SIGSTP',
      type: 'boolean',
      description: 'Request a job to stop'
    },
    3: {
      alias: 'SIGRES',
      type: 'boolean',
      description: 'Request a job to resume'
    }
  },
  async execute ([ jobId ], { SIGSTP, SIGRES }) {
    const signal = SIGRES ? 3 : SIGSTP ? 2 : 1

    signalService.send(jobId, signal)
  }
})

```

### userService
The user service retrieves users running on the bot adapter.
  * **`async getCurrentUser`** `Bool fullProjection -> User` get the user from the currently running process. If `fullProjection` is true, the entire user object will be included. If false (default), only the id will be returned in the user object.
  * **`async list`** `Nil -> Array<User>` get all users
  * **`async find`** `Object searchCriteria -> Array<User>` Find users matching the given criteria
  * **`async findOne`** `Object searchCriteria -> User [throws Error on no user found]` Returns the first user matching the given criteria

#### Example
```js
const example = async ({ userService }) => {
  const currentUser = await userService.getCurrentUser()
  const found = await userService.findOne({ id: 123 })
  console.log(found.name) // -> "konapun"
}
```

## Plugins
Each phase in the Orbital Frame lifecycle is pluggable on enter, exit, and error
and receives arguments being sent to the current phase from the previous phase
on `enter`), arguments being sent to the next phase on `exit`, or the error
object and exit args on `error`. By default, each plugged phase returns its
arguments unchanged but may intercept these arguments as needed which will
propogate downstream in the lifecycle.

### Handling Specific Errors
The following are specific errors that may be checked for using `instanceof` if
you wish to only handle a certain class of error in your error phase:
  * **CommandNotFoundError** thrown when the user requests to run a command which has not been registered under any name
  * **CompilationError** thrown when an error is encountered during the compilation phase
  * **ParseError** thrown when an error is encountered by the parser
  * **PermissionError** thrown when a user attempts to run permission-gated code
  * **SearchError** thrown when no items can be found that match search criteria
  * **StateError** thrown when an operation is rejected because of conflicting state
  * **ValidationError** thrown when an error occurs due to an unexpected schema or property

#### Example
```js
import { phase, error } from '@orbital-frame/core'
import damerauLevenshtein from 'talisman/metrics/distance/damerau-levenshtein'

const defaults = {
  sensitivity: 2
}

const didYouMean = options => ({ commandService, messengerService }) => ({
  [phase.EXECUTE]: {
    error (e, { context }) {
      if (!(e instanceof error.CommandNotFoundError)) return
      const { sensitivity } = { ...defaults, ...options }
      const command = context.message.text.split(/\s+/).splice(1).join(' ')

      const matches = Object.keys(commandService.registry).map(name => {
        const distance = damerauLevenshtein(command, name)
        return { name, distance }
      }).filter(({ distance }) => distance <= sensitivity)

      if (matches.length > 0) {
        messengerService.respond(context, `Did you mean:\n${matches.map(({ name }) => `    ${name}`).join('\n')}`)
      }
    }
  }
})

export { didYouMean }
export default didYouMean()
```

### Example Plugin
```js
import {phase} from '@orbital-frame/core'

function plugin () {
  return {
    [phase.LOAD_PLUGINS]: { // phases before exiting LOAD_PLUGINS aren't available for extension via plugins since they're not yet loaded
      exit () {
        console.log('Loaded plugins')
        console.log('----------')
      },
      error (e) {
        console.error('Error loading plugins:', e)
      }
    },
    [phase.LOAD_COMMANDS]: {
      enter () {
        console.log('Loading commands')
      },
      exit () {
        console.log('Loaded commands')
        console.log('----------')
      },
      error (e) {
        console.error('Error loading commands:', e)
      }
    },
    [phase.LISTEN]: {
      enter () {
        console.log('Listening')
      },
      exit () {
        console.log('Listened')
        console.log('----------')
      }
    },
    [phase.PROCESS]: {
      enter () {
        console.log('Processing')
      },
      exit () {
        console.log('Processed')
        console.log('----------')
      },
      error (e, args) {
        console.log('Error processing input:', e, args)
      }
    },
    [phase.EXECUTE]: {
      enter () {
        console.log('Executing')
      },
      exit () {
        console.log('Executed')
        console.log('----------')
      },
      error (e, args) {
        console.log('Error executing command:', e, args)
      }
    },
    [phase.RESPOND]: {
      enter () {
        console.log('Responding')
      },
      exit () {
        console.log('Responded')
        console.log('----------')
      }
    }
  }
}

export default plugin
```

## Commands
Commands are the primary means of extension for an Orbital Frame instance. A
command is a function which takes as input injected services (in the same way as
a plugin function) and returns an object with the following structure:
  * **name** the name the command will be invoked with
  * **description** help text for the command
  * **options** a mapping of single letter short options to:
    * **alias** long option alias for short option
    * **description** help text for option
    * **type** one of `number`, `string`, or `boolean`
    * **required** whether or not the option is required
    * **default** a default value for the option if the option isn't explicitly set
    * **valid** `Object<String, Any>, Array<Any> -> Boolean` validator for the option value
  * **execute** `Array<Any> arguments, Object<String, Any> options, Object<String, Any> metadata -> Any` a function which takes an array of arguments, a map of option keys to values from the command line, and execution metadata and returns a value
  * **format** `Any -> String` a function which takes as input the output from `execute` and returns a formatted string for display

Commands are assigned a unique ID on execute which can be accessed within
execute as `this.pid` or in the execute function's third argument which is its
`metadata`. In order to get the pid from `this` context you **MUST** use
function notation instead of arrow notation. Either style of function can
retrieve the pid from execute's third argument. The pid can be used as a unique
key for later retrieval.

### Example Command
```js
import { take, shuffle } from 'lodash'

export default () => ({
  name: 'choose',
  description: 'Choose from multiple choices',
  options: {
    n: {
      alias: 'number',
      description: 'Take n choices',
      type: 'number',
      default: 1
    }
  },
  format (choices) {
    return choices.join(' ')
  },
  execute (args, opts) {
    return take(shuffle(args), opts.number)
  }
})
```

### Interactive Commands
Commands can be made interactive by using the `interactionService` described
above. Messages must start with `>` in order to be intercepted by `prompt`.

```js
const interactiveCommand = ({ interactionService }) => ({
  name: 'test-interactive',
  description: 'Test interactive commands',
  format ({ name, age }) {
    return `Name: ${name}, Color: ${color}`
  },
  async execute () {
    const interaction = await interactionService.createInteractionChannel()

    const { text: name } = await interaction.prompt('What is your name?')
    const { text: color } = await interaction.prompt('What is your favorite color scheme?')

    return { name, color }
  }
})
```

Commands can implement their own subshell by using `observe`:
```js
export default ({ interactionService, signalService }) => ({
  name: 'observer',
  description: 'Testing observable interactions',
  async execute () {
    const interaction = await interactionService.createInteractionChannel()
    const signalHandler = await signalService.createSignalHandler()
    const stream = interaction.observe()

    let paused = false
    return new Promise(resolve => {
      signalHandler.onSignal(signalService.signal.SIGSTP, () => {
        paused = true
      })
      signalHandler.onSignal(signalService.signal.SIGRES, () => {
        paused = false
      })
      signalHandler.onSignal(signalService.signal.SIGINT, () => {
        stream.end()
        resolve('Caught signal SIGINT; exiting')
      })

      stream.pipe(({ user, text }) => {
        if (text === 'exit') {
          resolve('Exiting')
          stream.end()
        } else if (!paused) {
          // Your own unique text parsing can go here. Subshell commands will still be input with a > character by default (unless you've overridden `ps2` in your config)
          interaction.send(`User ${user.name} sent message: ${text}`)
        }
      })
    })
  }
})

```

#### Example usage
```sh
@jehuty test-interactive
What is your name? # Prompt generated by Orbital Frame
>konapun # User input. Note how ">" is needed to distinguish text for the interacive command from non-Orbital Frame message text
What is your favorite color scheme? # Prompt generated by Orbital Frame
>monokai # User input
Name: konapun, Color: monokai # Command output
```

## Pending Features/TODOs
  * [ ] Lazy evaluations
  * [ ] [Parameter Expresions](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)
