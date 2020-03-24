# O R B I T A L  -  F R A M E
**UNIX Command Line as a Chatbot**
[![Build Status](https://travis-ci.org/konapun/orbital-frame.svg?branch=master)](https://travis-ci.org/konapun/orbital-frame)

Unleash the power and flexibility of the UNIX command line with a chat bot!
Orbital Frame supports commands, options, variables, pipes, asynchronous
chaining, inline logical operators (via commands), functions, and a custom
language based on the venerable bash. For full details, visit the
[core README](./packages/orbital-frame-core/README.md).

This project is organized as a monorepo consisting of the following:
  - [@orbital-frame/core](./packages/orbital-frame-core/README.md) The core framework.
  - [@orbital-frame/jehuty](./packages/orbital-frame-jehuty/README.md) A reference implementation using core.
  - [@orbital-frame/parser](./packages/orbital-frame-parser/README.md) PEG grammar and parser which outputs an AST.
  - **@orbital-frame/plugin-*** Optional plugins that can be installed and loaded into your bot.
  - **@orbital-frame/command-*** Optional commands that can be installed and loaded into your bot.
  - **@orbital-frame/adapter-*** Adapters orbital frame can run on. `@orbital-frame/core` does not include an adapter by default so you must include one of these to use orbital-frame in your chat service.

## Examples
The examples below are using `@orbital-frame/jehuty`, a reference implementation
which is ready right out of the box.

```sh
@jehuty echo "hello, world!"
@jehuty NUM=10; calc $NUM + 2
@jehuty NUM=$(calc 9 + $(calc 1 + 1)); echo $NUM | calc + 2
@jehuty echo hi $(echo hello $(echo there))
@jehuty echo Counting $(calc 1 + 0) $(calc 1 + 1) $(calc 1 + 2) yay
@jehuty if $(equal 1 1) "they're equal" "they're not equal"
@jehuty alias test-alias 'if $(not $(equal 1 1)) "they're not equal" "they are equal"'
@jehuty test-alias
```

## Syntax
The bot command line is mostly a subset of Bash with a few exceptions. The main
features will be covered here. For parser details and the full grammar, see
[@orbital-frame/parser](./packages/orbital-frame-parser/README.md).

### Commands
`Documentation TODO`

### Pipes
`Documentation TODO`

### Signals
`Documentation TODO`

### Functions
Like Bash, the Orbital Frame command line supports two forms of functions which
are equivalent in the AST so it's a matter of your personal style:

##### form 1
```sh
function my_function {
  echo "This is form 1"
}

```
##### form 2
```sh
my_function () {
  echo "this is form 2"
}
```

Like Bash, function arguments are given through positional environment variables
$1 through $n, so even in the second form where parentheses are used, no
parameters can be listed.

#### Scoping
By default, all variables are declared in the global scope. If you want to
instead use lexical scoping, use the `local` keyword inside your function block:

```sh
MY_VAR=outer

function set_var {
  local MY_VAR=inner
  echo $MY_VAR
}

set_var # echoes "inner"
echo $MY_VAR # echoes "outer"
```

## Developing
This project uses [yarn](https://github.com/yarnpkg/yarn). See yarn's [installation guide](https://yarnpkg.com/en/docs/install) for installation instructions.
You can bootstrap the monorepo by running
```
yarn dev
```
