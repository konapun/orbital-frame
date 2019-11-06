# O R B I T A L - F R A M E
`@orbital-frame/core` is a framework for building chatbots that work similarly
to the UNIX command line, complete with commands, pipes, variables, etc. A
reference implementation is provided in `@orbital-frame/jehuty`.

## Creating a bot
```js
import orbitalFrame, { adapter } from '@orbital-frame/core'
import commands from './commands' // these are commands that you define
import plugins from './plugins' // these are plugins that you define

const jehuty = hubot => orbitalFrame(hubot, {
  name: 'jehuty', // name that the bot will respond to. For instance `@jehuty echo "hi"`
  commands,
  plugins,
  adapter: adapter.HUBOT
})

jehuty(hubotInstance).run()
```

## Adapters
Orbital Frame uses adapters to gain functionality for interacting with various
chat services. Currently, only the Hubot adapter is available and this is what
`@orbital-frame/jehuty` ships with.

### Creating adapters
TODO The adapters API is still in flux

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
  * **`async channelService.list`** `-> Array<Channel>` Get all channels
  * **`async channelService.find`** `Object searchCriteria -> Array<channel>` Find channels matching the given criteria
  * **`async channelService.findOne`** `Object searchCriteria -> channel [throws Error on no channel found]` Returns the first channel matching the given criteria

#### Example
```js
const example = async ({ channelService }) => {
  const allChannels = await channelService.list()
  const channel123 = await channelService.findOne({ id: 123 })
}
```

### commandService
The command service enables the loading of commands into the bot.
  * **`get commandService.registry`** `-> Array<Command>` Get all loaded commands
  * **`commandService.load`** `Array<Commands> | Command -> Nil` load a command

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
  * **`compilerService.compile`** `String -> Fn`
  * **`compilerService.compileWithMetadata`** `String -> { metadata: Object, command: Fn }` Build an executable command and metadata describing the command from a source string

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
The config service holds configuration information for the bot:
  * **`configService.name`** `-> String` The name of the bot
  * **`configService.commands`** `-> Array<Command>` A list of commands registered with the bot
  * **`configService.plugins`** `-> Array<Plugin>` A list of plugins registered with the bot
  * **`configService.adapter`** `-> Adapter` The adapter the bot is running on. Note that using the adapter
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
  * **`environmentService.set`** `String, Any -> Nil` Assign a value to a variable in the environment
  * **`environmentService.get`** `String -> Any` Retrieve a value for a variable in the environment

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
**MESSAGES INTERCEPTED BY `prompt` MUST START WITH A `>` IN ORDER TO DISTINGUISH
SUBCOMMANDS FROM NON-ORBITAL FRAME INPUT**
  * **createInteractionChannel** `Number pid` Create a channel for interacting with a user by command PID
    * **prompt** `String message -> Promise<Any>` Prompt the user for input
    * **send** `String message` Send text to the user

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
    const pid = this.pid // every command is assigned a unique pid on execute
    const interaction = await interactionService.createInteractionChannel(pid)

    const name = await interaction.prompt('What is your name?')
    const age = await interaction.prompt('What is your age?')

    return { name, age }
  }
})
```

### jobService
The job service associates commands with users and provides operations for
retrieving information for jobs.
  * **`async jobService.list`** `-> Array<Job>` Get all jobs
  * **`async jobService.find`** `Object searchCriteria -> Array<Job>` Find jobs matching the given criteria
  * **`async jobService.findOne`** `Object searchCriteria -> Job [throws Error on no job found]` Returns the first job matching the given criteria

#### Example
```js
const example = ({ jobService, userService }) => {
  const user = userService.find({ name: 'konapun' })
  const runningJobs = jobService.find({ user, status: 'running' })
  const finishedJobs = jobService.find({ user, status: 'finished' })
  const returnValues = finishedJobs.map(job => job.returnValue)
}
```

### listenerService
The listener service sets up a matcher with an action.
  * **`listenerService.listen`** `String -> StreamReader` Set up a listener and receive a stream reader to get responses written to the stream

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
  * **`messengerService.respond`** `Context, String -> Nil` Send a message in response to the sending context
  * **`messengerService.send`** `Channel, String -> Nil` Send a message to a channel
  * **`messengerService.reply`** `Context, String` Reply to a sending context

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

### pluginService
The plugin service is responsible for registering plugins.
(See below for documentation on creating your own plugins)
  * **`pluginService.load`** `Plugin | Array<Plugin> -> Nil` Load one or more plugins

#### Example
```js
import myPlugin from './my-plugin'
const example = ({ pluginService }) => {
  pluginService.load(myPlugin)
}
```

### userService
The user service retrieves users running on the bot adapter.
  * **`async userService.list`** `-> Array<User>` get all users
  * **`async userService.find`** `Object searchCriteria -> Array<User>` Find users matching the given criteria
  * **`async userService.findOne`** `Object searchCriteria -> User [throws Error on no user found]` Returns the first user matching the given criteria

#### Example
```js
const example = ({ userService }) => {
  const found = userService.findOne({ id: 123 })
  console.log(found.name) // -> "konapun"
}
```

## Plugins
Each phase in the Orbital Frame lifecycle is pluggable on both enter and exit
and receives as arguments either arguments being sent to the current phase from
the previous phase (`enter`) or arguments being sent to the next phase (`exit`).
By default, each plugged phase returns its arguments unchanged but may intercept
these arguments as needed which will propogate downstream in the lifecycle.

### Example Plugin
```js
import {phase} from '@orbital-frame/core'

function plugin () {
  return {
    [phase.LOAD_PLUGINS]: { // phases before exiting LOAD_PLUGINS aren't available for extension via plugins since they're not yet loaded
      exit () {
        console.log('Loaded plugins')
        console.log('----------')
      }
    },
    [phase.LOAD_COMMANDS]: {
      enter () {
        console.log('Loading commands')
      },
      exit () {
        console.log('Loaded commands')
        console.log('----------')
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
      }
    },
    [phase.EXECUTE]: {
      enter () {
        console.log('Executing')
      },
      exit () {
        console.log('Executed')
        console.log('----------')
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
    * **describe** help text for option
    * **type** one of `number`, `string`, or `boolean`
    * **required** whether or not the option is required
    * **default** a default value for the option if the option isn't explicitly set
    * **valid** `Object<String, Any>, Array<Any> -> Boolean` validator for the option value
  * **execute** `Array<Any>, Object<String, Any> -> Any` a function which takes an array of arguments and a map of option keys to values from the command line and returns a value
  * **format** `Any -> String` a function which takes as input the output from `execute` and returns a formatted string for display

Commands are assigned a unique ID on execute which can be accessed within
execute as `this.pid`. For this reason it's encouraged that you don't use arrow
functions to define execute as `this` won't have the required context needed to
retrieve the command's PID (a practical usage of PID is shown in the example for
"Interactive Commands").

### Example Command
```js
import { take, shuffle } from 'lodash'

export default () => ({
  name: 'choose',
  description: 'Choose from multiple choices',
  options: {
    n: {
      alias: 'number',
      describe: 'Take n choices',
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
    const pid = this.pid // every command is assigned a unique pid on execute
    const interaction = await interactionService.createInteractionChannel(pid)

    const name = await interaction.prompt('What is your name?')
    const color = await interaction.prompt('What is your favorite color scheme?')

    return { name, color }
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
  * [ ] Persistence service
  * [ ] User roles, feature permissions, permission service
  * [ ] Error codes for better error handling in plugins
  * [ ] Backgrounding jobs
  * [ ] Lazy evaluations
  * [ ] [Parameter Expresions](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html)
