// Raw driver functionality is gated so that any services that access these features will also be gated
const permissions = {
  LIST_PLUGINS: [ 'plugins' ],
  LIST_COMMANDS: [ 'commands' ],
  LISTEN: [ 'hear' ],
  SEND: [ 'send' ],
  GET_USERS: [ 'getUsers' ],
  GET_CHANNELS: [ 'getChannels' ],
  ACCESS_ADAPTER: [ 'adapter' ]
  // TODO: permissions for rate limiting, etc; API to allow permissions and roles to be added by plugins
}

/**
 * Limit functionality by user
 */
const permissionService = frame => ({ persistenceService }) => ({
  hasPermission (user, permission) {

  }
})

export default permissionService
