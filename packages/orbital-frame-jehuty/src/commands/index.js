import { uptimeCommand } from '@orbital-frame/plugin-uptime'
import calc from './calc'
import echo from './echo'
import exec from './exec'
import help from './help'
import trueCommand from './true'
import falseCommand from './false'
import ifCommand from './if'
import equal from './equal'
import and from './and'
import or from './or'
import not from './not'
import car from './car'
import cdr from './cdr'
import sleep from './sleep'
import alias from './alias'
import jobs from './jobs'
import whoami from './whoami'
import choose from './choose'
import interactive from './interactive'
import get from './get'
import noop from './noop'
import noFormat from './noFormat'
import length from './length'
import flatten from './flatten'
import xargs from './xargs'
import join from './join'
import split from './split'
import list from './list'
import head from './head'
import tail from './tail'
import quote from './quote'
import range from './range'
import repeat from './repeat'
import lessThan from './lessThan'
import greaterThan from './greaterThan'
import observer from './observer'
import kill from './kill'
import fg from './fg'
import promote from './promote'
import version from './version'

export default [
  uptimeCommand,
  calc,
  echo,
  exec,
  help,
  trueCommand,
  falseCommand,
  ifCommand,
  equal,
  and,
  or,
  not,
  car,
  cdr,
  sleep,
  alias,
  jobs,
  whoami,
  choose,
  interactive,
  get,
  noop,
  noFormat,
  length,
  flatten,
  xargs,
  join,
  split,
  list,
  head,
  tail,
  quote,
  range,
  repeat,
  lessThan,
  greaterThan,
  observer,
  kill,
  fg,
  promote,
  version
]
