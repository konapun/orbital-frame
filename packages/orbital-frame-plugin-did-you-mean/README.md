# @orbital-frame/plugin-did-you-mean
List possible intended command names upon receiving an invalid command

## Installing
```sh
npm install --save @orbital-frame/plugin-did-you-mean
```

## Usage
```js
import didYouMean from '@orbital-frame/plugin-did-you-mean'

// add `didYouMean` to your bot's plugins
```

## Configuring
This plugin exports both a configurable and preconfigured version. The default
export is preconfigured to use a sensitivity of 2 which is the upper bound for
the Damerau-Levenshtein distance. To configure your own value, use the named
export `didYouMean`.A higher value for the sensitivity will return
more results.

### Example
```js
import { didYouMean } from '@orbital-frame/plugin-did-you-mean'

const configuredPlugin = didYouMean({ sensitivity: 5 })
// add `configuredPlugin` to your bot's plugins
```

## In-Bot Example
```
> @jehuty hlep
Did you mean:
    help
```

## Runtime Complexity
This plugin uses Damerau-Levenshtein distance as its similarity measure which
has a runtime complexity of O(n*m), where n and m are the lengths of the strings
being compared. This is applied against every loaded command on error which
gives a final runtime complexity of ~O(n^2) which may introduce significant
overhead if there are many commands loaded.
