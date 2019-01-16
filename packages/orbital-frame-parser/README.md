## Introduction
This is a parser generator whose output is a parser which produces an AST for
consumption by @orbital-frame/core.

The command grammar is a modified subset of bash's grammar:
  - command
  - options
  - arguments
    - short
    - long
  - pipes
  - multiple commands per line
  - redirect (for channels)
  - command substitution
    - interpolated commands can be used as either arguments or option values
  - variables
    - predefined:
      - `$$` - last command
      - `$?` - exit status of last command

## AST
The grammar can be found [here](./grammar/unix.pegjs).

### Example
The command
```
channel-history #random | filter --user $(whoami) > #general
```
would parse to `TODO`
```js
// I don't know yet!
```
