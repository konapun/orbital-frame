Program
  = lhs:Pipeline ";" rhs:Pipeline { return { "type": "Program", "pipelines": [ lhs, rhs ] }; }
  / pipeline:Pipeline { return { "type": "Program", "pipelines": [ pipeline ] }; }

Pipeline
  = _ Command _ "|" Pipeline { /* TODO: */ }
  / _ command:Command _ Redirect
  / _ command:Command _ { return { "type": "Command", "command": command }}

Command
  = InterpolatedCommand
  / BareCommand

InterpolatedCommand
  = "$(" command:Command ")" { return { "type": "InterpolatedCommand", "command": command } }

BareCommand
  = _ name:Word _ preOptions:Option* _ arguments:Arguments* _ postOptions:Option*

Redirect
  = ">" channel:Word { return { "type": "Redirect", "channel": channel }; }

Option
  = longOption:LongOption _ options:Option* { return { "type": "Option", "options": [ longOption, ...options ] }; }
    / shortOption:ShortOption _ options:Option* { return { "type": "Option", "options": [ shortOption, ...options ] }; }

LongOption
  = "--" name:Word _ ?argument:Argument { return { "type": "Option", "name": name, "argument": argument }; }

ShortOption
  = "-" name:Letter _ ?argument:Argument { return { "type": "Option", "name": name, "argument": argument }; }

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

Word = word:[a-zA-Z0-9_-]+ { return word.join(''); }

Letter = [a-zA-Z]

_  = [ \t\r\n]*
