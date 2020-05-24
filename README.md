# O R B I T A L  -  F R A M E
**UNIX Command Line as a Chatbot**
[![Build Status](https://travis-ci.org/konapun/orbital-frame.svg?branch=master)](https://travis-ci.org/konapun/orbital-frame)
[![DeepScan grade](https://deepscan.io/api/teams/8479/projects/10684/branches/150761/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8479&pid=10684&bid=150761)

Unleash the power and flexibility of the UNIX command line with a chat bot!
Orbital Frame supports commands, options, variables, pipes, asynchronous
chaining, inline logical operators (via commands), functions, jobs, signals,
plugins, and a custom language based on the venerable bash. For full details,
visit the [core README](./packages/orbital-frame-core/README.md).

[Try it online!](https://konapun.github.io/projects/orbital-frame)

This project is organized as a monorepo consisting of the following:
  - [@orbital-frame/core](./packages/orbital-frame-core/README.md) The core framework.
  - [@orbital-frame/jehuty](./packages/orbital-frame-jehuty/README.md) A reference implementation using core.
  - [@orbital-frame/parser](./packages/orbital-frame-parser/README.md) PEG grammar and parser which outputs an AST.
  - [@orbital-frame/core-commands](./packages/orbital-frame-core-commands/README.md) A collection of optional starter commands to load into your bot. `@orbital-frame/jehuty` uses these.
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
features will be covered here. Although not included for the sake of brevity and
because it will vary based on your bot's configuration, every example below must
start by hailing your bot so it understands the message is intended for it. For
parser details and the full grammar, see
[@orbital-frame/parser](./packages/orbital-frame-parser/README.md).

### Commands
Commands can be called with arguments and options. The options and option types
a command accepts are provided by the command's author in the command
definition. A detailed explanation for command authors is provided
[here](./packages/orbital-frame-core/README.md#Commands).

```sh
some_command --some_option option_value arg1 arg2
```

#### Options
Command options can either be valued or boolean, which is defined in the command
itself.Command options can be either short form or long form:

```sh
some_command --long_option option_value
# or
some_command -s option_value
```

Unlike long options, short options can be chained:
```sh
some_command -abcd arg # here, a, b, c, and d are all options. a, b, and c are boolean options while d is being passed the argument "arg"
```

#### Interpolated Commands
Commands can be immediately evaluated for use as arguments, option values, etc.
by surrounding the command or pipeline with `$()`:

```sh
echo "three plus two is " $(calc 3 + 2)
```

#### Interactive Commands
Some commands start an interactive session where the command can receive
nonblocking input throughout its lifespan. The interaction character is
configurable based on your bot but defaults to `>`. For full details, see
documentation in the @orbital-frame/core [README](./packages/orbital-frame-core/README.md#Interactive%20Commands):
```sh
interactive_command # some command that starts an interaction
some_other_command # the interaction will not intercept this command
> interactive_input # because this command is prefixed with the interaction character, it will be sent to the interactive command
```

### Pipes
Pipes are pipelines of commands (or functions) who pass their output as input
into the next pipe.

```sh
whoami | uppercase
```

### Variables
Variables are key/value pairs:

```sh
MY_KEY="some value" # set a variable
echo $MY_KEY # retrieve a value
```

The following variables are built-in:
  * **`0`** The name of the currently executing command
  * **`1 .. n`** Positional arguments (used for getting arguments within a function)
  * **`#`** The number of command line arguments
  * **`@`** All command line arguments as an array
  * **`!`** The PID of the current command
  * **`?`** The exit status of the most recently executed command

### Signals
See documentation in the @orbital-frame/core [README](./packages/orbital-frame-core/README.md#signalService)

### Functions
Like Bash, the Orbital Frame command line supports two forms of functions which
are equivalent in the AST so it's a matter of your personal style:

##### Form 1
```sh
function my_function {
  echo "This is form 1"
}

```
##### Form 2
```sh
my_function () {
  echo "this is form 2"
}
```

Like Bash, function arguments are given through positional environment variables
$1 through $n, so even in the second form where parentheses are used, no
parameters can be listed.

```sh
function say_hello {
  echo Hello, $1
}

say_hello konapun # displays "Hello, konapun"
```

#### Control Structures
To keep the syntax simple, the Orbital Frame grammar does not include any
control structures such as if statements or loops but these can be easily
replicated using commands. Here is an additional example using commands loaded
into jehuty which demonstrates how to do branching using the `if` and `and`
commands rather than dedicated control structures:

```sh
@jehuty function analyze_length {
    local WORD=$1
    local LOWER=$2
    local UPPER=$3
    local WORD_LENGTH=$(split -d '' $WORD | length)

    if $(and $(greater-than $WORD_LENGTH $LOWER) $(less-than $WORD_LENGTH $UPPER)) "String is valid" "String is invalid"
}

@jehuty analyze_length "fits" 1 5 # displays "String is valid"
```

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
