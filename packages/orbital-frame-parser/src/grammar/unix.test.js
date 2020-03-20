import { parse } from './unix'

describe('parser', () => {
  it('should parse a program with no options or arguments', () => {
    const program = 'test'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test' ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should parse a program with arguments and no options', () => {
    const program = 'test arg1 arg2'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', { body: [ 'arg1' ], type: 'Argument' }, { body: [ 'arg2' ], type: 'Argument' } ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should parse a program with options and no arguments', () => {
    const program = 'test --opt1 -o'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ { body: [ 'opt1', null ], type: 'Option' }, [ [ { body: [ 'o', null ], type: 'Option' } ] ] ] ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should parse a program with boolean options', () => {
    const program = 'test --bool --string yee'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ { body: [ 'bool', null ], type: 'Option' }, [ { body: [ 'string', { body: [ 'yee' ], type: 'Argument' } ], type: 'Option' } ] ] ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should split chained single opts', () => {
    const program = 'test -abcd arg'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ [ { body: [ 'a', { body: [], type: 'Argument' } ], type: 'Option' }, { body: [ 'b', { body: [], type: 'Argument' } ], type: 'Option' }, { body: [ 'c', { body: [], type: 'Argument' } ], type: 'Option' }, { body: [ 'd', { body: [ 'arg' ], type: 'Argument' } ], type: 'Option' } ] ] ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should allow variables', () => {
    const program = 'ARG=test; ARG2="test space"'

    expect(parse(program)).toEqual({ body: [ { body: [ 'ARG', { body: [ 'test' ], type: 'Argument' }, null ], type: 'Assignment' }, { body: [ 'ARG2', { body: [ 'test space' ], type: 'Argument' }, null ], type: 'Assignment' } ], type: 'Program' })
  })

  it('should allow scoped variables', () => {
    const program = 'local ARG=test'

    expect(parse(program)).toEqual({ body: [ { body: [ 'ARG', { body: [ 'test' ], type: 'Argument' }, { body: [ 'local', true ], type: 'ScopeModifier' } ], type: 'Assignment' } ], type: 'Program' })
  })

  it('should parse post-argument options', () => {
    const program = 'test arg1 arg2 --opt opt1'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ { body: [ 'opt', { body: [ 'opt1' ], type: 'Argument' } ], type: 'Option' } ], { body: [ 'arg1' ], type: 'Argument' }, { body: [ 'arg2' ], type: 'Argument' } ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should parse split pre- and post-argument options', () => {
    const program = 'test --opt1 opt1 arg1 arg2 --opt2 opt2'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ { body: [ 'opt1', { body: [ 'opt1' ], type: 'Argument' } ], type: 'Option' } ], [ { body: [ 'opt2', { body: [ 'opt2' ], type: 'Argument' } ], type: 'Option' } ], { body: [ 'arg1' ], type: 'Argument' }, { body: [ 'arg2' ], type: 'Argument' } ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should allow mixed short and long opts', () => {
    const program = 'test -o opt1 --opt2 opt2'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test', [ [ { body: [ 'o', { body: [ 'opt1' ], type: 'Argument' } ], type: 'Option' } ], [ { body: [ 'opt2', { body: [ 'opt2' ], type: 'Argument' } ], type: 'Option' } ] ] ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should allow a program made of only an interpolation', () => {
    const program = '$(test)'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ { body: [ { body: [ 'test' ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Interpolation' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should correctly parse an alias', () => {
    const program = 'alias test-alias \'if $(not $(equal 1 1)) "not equal" "are equal"\''

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'alias', { body: [ 'test-alias' ], type: 'Argument' }, { body: [ 'if $(not $(equal 1 1)) "not equal" "are equal"' ], type: 'Argument' } ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should allow piping from an interpolation', () => {
    const program = 'test1 | $(test2) | test3'

    expect(parse(program)).toEqual({ body: [ { body: [ { body: [ 'test1' ], type: 'Command' }, { body: [ { body: [ { body: [ 'test2' ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Interpolation' }, { body: [ 'test3' ], type: 'Command' } ], type: 'Pipeline' } ], type: 'Program' })
  })

  it('should allow functions', () => {
    const program = 'function test { echo $1 }'

    expect(parse(program)).toEqual({ type:'Program',body:[ { type:'Function',body:[ 'test',[ { type:'Pipeline',body:[ { type:'Command',body:[ 'echo',{ type:'Variable',body:[ '1' ] } ] } ] } ] ] } ] })
  })
})
