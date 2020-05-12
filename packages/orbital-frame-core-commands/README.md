# @orbital-frame/core-commands
A collection of optional starter commands for an orbital-frame bot. All included
commands are chat service agnostic so they should work with an orbital-frame bot
running anywhere.

## Installing
```sh
npm install @orbital-frame/core-commands
```

## Usage
```js
import orbitalFrame from '@orbital-frame/core'
import hubotAdapter from '@orbital-frame/adapter-hubot'
import coreCommands from '@orbital-frame/core-commands'
import myCommands from './commands'
import plugins from './plugins'
import hubotConfig from './config'

export default hubot => orbitalFrame(hubotAdapter(hubot, hubotConfig), {
  name: 'jehuty',
  commands: [ ...coreCommands, ...myCommands ],
  plugins
})
```

## Bundled Commands
  * **alias** Create an alias for a command string
  * **and** Evaluate the AND of two conditions to a boolean
  * **calc** Evaluate a mathematical expression
  * **car** Treat input as a const cell and get the first contents
  * **cdr** Treat input as a const cell and get the rest of the contents after car
  * **choose** Choose one or more values from multiple choices
  * **echo** Write arguments to output
  * **equal** Check two or more arguments for equality
  * **exec** Execute a string as a command
  * **false** Return false
  * **fg** Foreground an interactive job
  * **flatten** Flatten array data to a string
  * **get** Retrieve data at a position from a list
  * **greater-than** Check whether one number is greater than another
  * **head** Return items from the front of input
  * **help** List all available commands and help dialog for an individual command
  * **if** Branch based on a condition
  * **jobs** List jobs and their statuses
  * **join** Join input by a character
  * **kill** Send a signal to a job
  * **length** Get argument length
  * **less-than** Check whether one number is less than another
  * **list** Convert arguments to a list
  * **no-format** Get the raw output of a command without running it through its formatter
  * **noop** No operation
  * **not** Get the logical inversion of a value
  * **or** Evaluate the OR of two conditions to a boolean
  * **promote** Promote a user to a superuser
  * **range** Generate an inclusive range
  * **repeat** Repeat output
  * **sleep** Wait for a specified amount of time
  * **split** Split input by a character
  * **tail** Return items from the end of input
  * **true** Return true
  * **whoami** Get the current user
  * **xargs** Distribute list items to a command
