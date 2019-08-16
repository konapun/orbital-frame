# @orbital-frame/plugin-rc
Loads and executes file of orbital frame commands each time the bot is started

```js
import rcPlugin from '@orbital-frame/plugin-rc'

const loadRc = rcPlugin({
  file: `${__dirname}/../../orbital-frame.rc`
})

// add `loadRc` to your bot's plugins
```
