# O R B I T A L  -  F R A M E
**UNIX Command Line as a Chatbot**
[![Build Status](https://travis-ci.org/konapun/orbital-frame.svg?branch=master)](https://travis-ci.org/konapun/orbital-frame)

There are many bots that allow one to create custom commands. This bot
framework, however, provides that ability along with the power and flexibility
of the UNIX command line by employing commands, options, variables, pipes,
asynchronous chaining, inline logical operators (via commands), inline scripting
for creating new commands at runtime (via aliases), and a custom language based
on the venerable bash.

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

## Developing
This project uses [yarn](https://github.com/yarnpkg/yarn). See yarn's [installation guide](https://yarnpkg.com/en/docs/install) for installation instructions.
You can bootstrap the monorepo by running
```
yarn dev
```
