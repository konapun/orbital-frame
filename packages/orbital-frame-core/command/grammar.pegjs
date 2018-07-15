/**
 * The command grammar is a subset of bash's grammar:
 *  - command
 *  - options
 *  - arguments
 *    - short
 *    - long
 *  - pipes
 *  - multiple commands per line
 *  - redirect (for channels)
 *  - command substitution
 *  - variables
 *    - predefined:
 *      - $$ - last command
 *      - $? - exit status of last command
 *  - &&
 *  - ||
 */

Command
  = InterpolatedCommand
  / BareCommand

InterpolatedCommand
  = "$(" command:Command ")" { return command }

BareCommand
  = _ name:Word _ preOptions:Options* _ arguments:Arguments* _ postOptions:Options*

Options
  = "options"

Arguments
  = "arguments"

String
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }

Word = [a-zA-Z0-9_-]+

_  = [ \t\r\n]*
