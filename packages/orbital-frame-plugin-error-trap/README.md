# @orbital-frame/plugin-error-trap
Intercept error messages and redirect them to channel output

## Installing
```sh
npm install --save @orbital-frame/plugin-error-trap
```

## Usage
```js
import errorTrap from '@orbital-frame/plugin-error-trap'

// add `errorTrap` to your bot's plugins
```

**Because plugins are loaded in order, error-trap should be loaded at the top in order to process all errors**
