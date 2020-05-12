## Introduction
This is a parser generator whose output is a parser which produces an AST for
consumption by @orbital-frame/core.

## Installing
```sh
npm install --save @orbital-frame/parser
```

The command grammar is a modified subset of bash's grammar:
  - command
  - options
    - short
    - long
  - arguments
  - pipes
  - multiple commands per line
  - command substitution
    - interpolated commands can be used as either arguments or option values
  - variables
  - functions
    - including optional lexical scoping

## AST
The grammar can be found [here](./src/grammar/unix.pegjs).

### Example
The command
```
CHANNEL="#random"; channel-history $CHANNEL | filter --user $(whoami)
```
parses to
```js
{
   "type": "Program",
   "body": [
      {
         "type": "Assignment",
         "body": [
            "CHANNEL",
            "#random"
         ]
      },
      {
         "type": "Pipeline",
         "body": [
            {
               "type": "Command",
               "body": [
                  "channel-history",
                  {
                     "type": "Argument",
                     "body": [
                        {
                           "type": "Variable",
                           "body": [
                              "CHANNEL"
                           ]
                        }
                     ]
                  }
               ]
            },
            {
               "type": "Command",
               "body": [
                  "filter",
                  [
                     {
                        "type": "Option",
                        "body": [
                           "user",
                           {
                              "type": "Argument",
                              "body": [
                                 {
                                    "type": "Interpolation",
                                    "body": [
                                       {
                                          "type": "Pipeline",
                                          "body": [
                                             {
                                                "type": "Command",
                                                "body": [
                                                   "whoami"
                                                ]
                                             }
                                          ]
                                       }
                                    ]
                                 }
                              ]
                           }
                        ]
                     }
                  ]
               ]
            }
         ]
      }
   ]
}
```

## Differences from bash
Orbital Frame uses a stricter grammar than bash and in doing so avoids some
annoying and perhaps surprising edge cases.

***

In bash, variables are expanded in place so things like this are allowed:
```
ARG="-n"; echo $ARG test
```
which would allow `-n` to be used to specify an option. Orbital Frame, however,
only allows variables to be used as arguments to commands and command options.

***

Bash allows evaluating strings as options so the following
```
echo "-n" test
```
will print "test" without a newline character while Orbital Frame passes both
"-n" and "test" as arguments to `echo`

***

Bash also allows similar behavior with regards to command interpolation.
In bash,
```
echo $(echo "-n ") test
```
will print "test" without a newline character while Orbital Frame passes both
"-n" (the evaluation of the interpolated command) and "test" as arguments to
`echo`.

***

Bash treats single- and double-quoted strings differently, where double-quoted
strings allow interpolation and single-quoted strings do not. Orbital Frame
doesn't allow string interpolation at all (at least for now).
