Program
  = _ pipeline:Pipeline _ pipelines:(";" _ Pipeline)* ";"* { return { type: "Program", body: [ pipeline, ...pipelines ] } }

Pipeline
  = _ command:Command _ commands:("|" _ Command)* { return { type: "Pipeline", body: [ command, ...commands ] } }

Command
  = BareCommand
  / InterpolatedCommand

BareCommand
  = name:Word _ preOptions:Option* _ args:(Argument _)* _ postOptions:Option* { return { type: "Command", body: [ name, ...[ ...preOptions, ...postOptions ], ...args ] } }

InterpolatedCommand
  = "$(" _ command:Command _ ")" { return { type: "InterpolatedCommand", body: [ command ] } }

Assignment
  = variable:Word "=" value:String { return { type: "Assignment", body: [ variable, value ] } }

Option
  = option:LongOption _ options:Option* { return [ option, ...options ] }
    / option:ShortOption _ options:Option* { return [ option, ...options ] }

LongOption
  = "--" name:Word _ ?arg:Argument { return { type: "Option", body: [ name, arg ] } }

ShortOption
  = "-" name:Letter _ ?arg:Argument { return { type: "Option", body: [ name, arg ] } }

Argument
  = variable:Variable { return { type: "Argument", body: variable } }
  / word:Word { return { type: "Argument", body: word } }
  / string:String { return { type: "Argument", body: string } }

String
  = '"' chars:DoubleStringCharacter* '"' { return chars.join('') }
  / "'" chars:SingleStringCharacter* "'" { return chars.join('') }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char }
  / "\\" sequence:EscapeSequence { return sequence }

SingleStringCharacter
  = !("'" / "\\") char:. { return char }
  / "\\" sequence:EscapeSequence { return sequence }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"   }
  / "f"  { return "\f"   }
  / "n"  { return "\n"   }
  / "r"  { return "\r"   }
  / "t"  { return "\t"   }
  / "v"  { return "\x0B" }

Variable
  = "$" variable:Word { return { type: "Variable", body: variable } }

Word = word:[a-zA-Z0-9_-]+ { return { type: "Word", body: word.join('') } }

Letter = [a-zA-Z]

_  = [ \t\r\n]*
