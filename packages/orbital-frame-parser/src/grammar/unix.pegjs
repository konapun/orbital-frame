Program
  = __ statement:Statement _ rest:(ExpressionTerminator __ Statement)* _ ExpressionTerminator* {
      const statements = rest.map(part => part[2])
      return { type: "Program", body: [ statement, ...statements ] }
    }

Statement
  = Assignment
  / Function
  / Pipeline

Assignment
  = scope:ScopeModifier? _ variable:Word "=" value:Argument { return { type: "Assignment", body: [ variable, (scope || "global"), value ] } }

ScopeModifier
  = GlobalModifier
  / LocalModifier

GlobalModifier
  = "global" { return "global" }

LocalModifier
  = "local" { return "local" }

Function
  = ExplicitFunction
  / ImplicitFunction

ExplicitFunction
  = "function" _ name:Word __ "{" __ body:FunctionBody? __ "}" { return { type: "Function", body: [ name, body ] } }

ImplicitFunction
  = name:Word _ "()" __ "{" __ body:FunctionBody? __ "}" { return { type: "Function", body: [ name, body ] } }

FunctionBody
  = _ statement:FunctionBodyStatement _ rest:(ExpressionTerminator __ FunctionBodyStatement)* _ ExpressionTerminator* {
    const statements = rest.map(part => part[2])
    return [ statement, ...statements ]
  }

FunctionBodyStatement
  = Assignment
  / Pipeline

Pipeline
  = _ command:Command _ rest:("|" _ Command _)* {
      const commands = rest.map(part => part[2])
      return { type: "Pipeline", body: [ command, ...commands ] }
    }

Command
  = BareCommand
  / Interpolation

BareCommand
  = name:Word _ preOptions:Option* _ argsParts:(Argument _)* _ postOptions:Option* {
      const args = argsParts.map(part => part[0])
      return { type: "Command", body: [ name, ...[ ...preOptions, ...postOptions ], ...args ] }
    }

Interpolation
  = "$(" _ pipeline:Pipeline _ ")" { return { type: "Interpolation", body: [ pipeline ] } }

Option
  = option:LongOption _ options:Option* { return [ option, ...options ] }
    / option:ShortOption _ options:Option* { return [ option, ...options ] }

LongOption
  = "--" name:Word _ arg:Argument? { return { type: "Option", body: [ name, arg ] } }

ShortOption
  = "-" options:LetterOrDigit+ _ arg:Argument? {
      const chainArgument = {
        type: "Argument",
        body: []
      }
      return options
        .map((letterOrDigit, index) => {
          return { type: "Option", body: [ letterOrDigit, index === options.length -1 ? arg : chainArgument ] }
        })
    }

Argument
  = interpolation:Interpolation
  / variable:Variable
  / text:Text { return { type: "Argument", body: [ text ] } }

Text
  = Word
  / String

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
  = "$" variable:Word { return { type: "Variable", body: [ variable ] } }

ExpressionTerminator
  = ";"
  / Newline

Word = word:([a-zA-Z0-9_%#@\+\*\^\?\!][a-zA-Z0-9_%#@\+\*\^\?\!\-]*) { const [ start, rest ] = word; return [ start, ...rest ].join('')  }

LetterOrDigit = [a-zA-Z0-9]

Newline = [\r\n|\r|\n]

Whitespace = [  \t]

__ = _ Newline* _

_  = Whitespace*
