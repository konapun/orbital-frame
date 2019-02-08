# O R B I T A L - F R A M E
`@orbital-frame/core` is a framework for building chatbots that work similarly
to the UNIX command line, complete with commands, pipes, variables, etc. A
reference implementation is provided in `@orbital-frame/jehuty`.

## Creating a bot
```js
import orbitalFrame, { adapter } from '@orbital-frame/core'
import commands from './commands' // these are commands that you define
import plugins from './plugins' // these are plugins that you define

export default hubot => orbitalFrame(hubot, {
  name: 'jehuty', // name that the bot will respond to. For instance `@jehuty echo "hi"`
  commands,
  plugins,
  adapter: adapter.HUBOT
})

```

## Adapters
Orbital Frame uses adapters to gain functionality for interacting with various
chat services. Currently, only the Hubot adapter is available and this is what
`@orbital-frame/jehuty` ships with.

### Creating adapters
TODO

## Runtime
The Orbital Frame lifecycle consists of the following stages:
  - **loadPlugins** loads plugins into the Orbital Frame lifecycle
  - **loadCommands** loads commands into the Orbital Frame lifecycle
  - **listen** sets up a responder for every time this bot is mentioned.
      *NOTE*: the exit phase triggers when the responder is set up, not when the
      responder has been triggered (see *process*)
  - **process** processes a message produced from the bot's invocation
  - **execute** executes a command built from the message
  - **respond** returns the command's output

## Services
Orbital Frame uses dependency injection (DI) to expose its various configured
subsystems for use within the lifecycle and user-defined commands and plugins.

### commandService
The command service enables the loading of commands into the bot.

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

#### Example
```js
const example = ({ compilerService }) => {
  const source = 'VAR=test; echo $VAR | transform-text --uppercase'
  const command = compilerService.compile(source)
  const output = command()
}
```

### configService
The config service holds configuration information for the bot.

#### Example
```js
const example = ({ configService }) => {
  const { name, commands, plugins } = configService
}
```

### environmentService
The environment service is used to store and retrieve variables.

#### Example
```js
const example = ({ environmentService, compilerService }) => {
  environmentService.set('TEST_VAR', 'hello')
  const value = environmentService.get('TEST_VAR')

  const command = compilerService.compile('echo $TEST_VAR')
  command() // This will echo "hello" as set in the environment
}
```

### listenerService
The listener service sets up a matcher with an action.

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

#### Example
```js
const example = ({ messengerService }) => {
  // TODO: this service isn't finalized
}
```

### pluginService
The plugin service is responsible for registering plugins.
(See below for documentation on creating your own plugins)

#### Example
```js
import myPlugin from './my-plugin'
const example = ({ pluginService }) => {
  pluginService.load(myPlugin)
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
TODO

### Interactive Commands
TODO

### Jobs
TODO

## Users
TODO
