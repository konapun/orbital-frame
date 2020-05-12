## Introduction
This is an adapter for orbital-frame to use [Hubot](https://hubot.github.com/)
as the underlying interaction mechanism.

## Installing
```sh
npm install @orbital-frame/adapter-hubot
```

## Usage
```js
import orbitalFrame from '@orbital-frame/core'
import hubotAdapter from '@orbital-frame/adapter-hubot'
import commands from './commands'
import plugins from './plugins'
import hubotConfig from './config'

export default hubot => orbitalFrame(hubotAdapter(hubot, hubotConfig), {
  name: 'jehuty',
  commands,
  plugins
})
```

### Configuration
(none yet)

**NOTE: THIS ADAPTER HAS ONLY BEEN TESTED WITH SLACK AND MAY HAVE SOME ISSUES WITH OTHER SERVICES**. Please open an issue if you encounter a bug with your chat service.

## Service-Specific Features
### Slack
Slack uses triple backticks (```) to start and end a formatted block. This
adapter removes these blocks before passing the message to the core framework so
client-side text formatting can be used when issuing commands:
