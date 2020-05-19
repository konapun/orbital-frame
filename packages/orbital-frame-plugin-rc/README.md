# @orbital-frame/plugin-rc
Load and execute file of orbital frame commands each time the bot is started.
This is useful for bootstrapping an environment (variables, aliases, functions, etc.).

## Installing
```sh
npm install --save @orbital-frame/plugin-rc
```

## Usage
```js
import rcPlugin from '@orbital-frame/plugin-rc'

const loadRc = rcPlugin({
  file: `${__dirname}/../../orbital-frame.rc`
})

// add `loadRc` to your bot's plugins
```
