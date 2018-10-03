/**
 * The command grammar is a modified subset of bash's grammar:
 *  - command
 *  - options
 *  - arguments
 *    - short
 *    - long
 *  - pipes
 *  - multiple commands per line
 *  - redirect (for channels)
 *  - command substitution
 *    - interpolated commands can be used as either arguments or option values
 *  - variables
 *    - predefined:
 *      - $$ - last command
 *      - $? - exit status of last command
 */

Program
  = Pipeline ";" Pipeline
  / Pipeline

Pipeline
  = _ Command _ "|" Pipeline
  / _ Command _

Command
  = InterpolatedCommand
  / BareCommand

InterpolatedCommand
  = "$(" command:Command ")" { return command }

BareCommand
  = _ name:Word _ preOptions:Option* _ arguments:Arguments* _ postOptions:Option*

Redirect
  = ">" "TODO"

Option
  = LongOption _ Option*
    / ShortOption _ Option*

LongOption
  = "--" Word _ ?Argument

ShortOption
  = "-" Letter _ ?Argument

Arguments
  = (Argument _)+

Argument
  = Variable
  / Word
  / String

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

Variable
  = "$" variable:Word { return variable; }

Word = [a-zA-Z0-9_-]+

Letter = [a-zA-Z]

_  = [ \t\r\n]*
