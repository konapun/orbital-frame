# O R B I T A L - F R A M E
`@orbital-frame/core` is a framework for building chatbots that work similarly
to the UNIX command line, complete with commands, pipes, variables, redirection,
etc. A reference implementation is provided in `@orbital-frame/jehuty`.

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
subsystems for use within the lifecycle and user-defined commands.
  - **commandService**
  - **configService**
  - **listenerService**
  - **memoryService**
  - **messengerService**
  - **parserService**
  - **pluginService**

## Plugins
Each phase in the Orbital Frame lifecycle is pluggable on both enter and exit
and receives as arguments either arguments being sent to the current phase from
the previous phase (`enter`) or arguments being sent to the next phase (`exit`).
By default, each plugged phase returns its arguments unchanged but may intercept
these arguments as needed which will propogate downstream in the lifecycle.

## Commands
TODO

### Interactive Commands
### Jobs
