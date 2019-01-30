{
  // TODO: js stuff
}

Program
  = pipelines:(Pipeline _ ";")+ { return { type: "Program", body: [ ...pipelines ] } }
  / pipeline:Pipeline { return { type: "Program", body: [ pipeline ] } }

Pipeline
  = _ lhs:Command _ "|" _ rhs:Pipeline { return { type: "Pipeline", body: [ lhs, rhs ] } }
  / _ command:Command _ redirect:Redirect { return { type: "Pipeline", body: [ command, redirect ] } }
  / _ command:Command _ { return { type: "Pipeline", body: [ command ] } }

Command
  = InterpolatedCommand
  / BareCommand

InterpolatedCommand
  = "$(" command:Command ")" { return { type: "InterpolatedCommand", body: [ command ] } }

BareCommand
  = name:Word _ preOptions:Option* _ args:(Argument _)* _ postOptions:Option* { return { type: "Command", value: [ name, [ ...preOptions, ...postOptions ], ...args ] } }

Assignment
  = variable:Word "=" value:String { return { type: "Assignment", value: [ variable, value ]}}

Redirect
  = ">" channel:Word { return { type: "Redirect", value: channel } }

Option
  = longOption:LongOption _ options:Option* { return { type: "Option", value: [ longOption, options ] } }
    / shortOption:ShortOption _ options:Option* { return { type: "Option", value: [ shortOption, options ] } }

LongOption
  = "--" name:Word _ ?arg:Argument { return { type: "LongOption", value: [ name, arg ] } }

ShortOption
  = "-" name:Letter _ ?arg:Argument { return { type: "ShortOption", value: [ name, arg ] } }

Argument
  = variable:Variable { return { type: "Argument", value: variable } }
  / word:Word { return { type: "Argument", value: word } }
  / string:String { return { type: "Argument", value: string } }

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
  = "$" variable:Word { return { type: "Variable", value: variable } }

Word = word:[a-zA-Z0-9_-]+ { return word.join('') }

Letter = [a-zA-Z]

_  = [ \t\r\n]*
