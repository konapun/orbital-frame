export default ({ interactionService, userService }) => ({
  name: 'multiuser-interactive',
  description: 'Testing an interactive command that supports multiple users',
  execute: async (usernames, opts, { pid }) => {
    const users = usernames.map(async username => userService.findOne({ username })) // user service will throw an error if no user can be found with that username

    const interaction = await interactionService.createInteractionChannel(pid, users.map(({id}) => id)) // this creates a channel listener and sets the active command for each user in the channel to this command
    interaction.send(`Welcome to the multi-user test command. Interaction order is: ${users.map(({username}) => username).join(',')}`)

    const userList = circularTraversal(users)
    while (true) {
      const response = await interaction.promt(`${userList.value}'s turn`)
      if (response === 'exit') {
        break
      }
      userList.next() // TODO:
    }
  }
})

const linkedList = elements => elements.map((value, index) => {
  const next = index === elements.length -1 ? 0 : index + 1
  return { value, next }
})

const circularTraversal = elements => {
  const list = linkedList(elements)

  let value = list.value
  return {
    next () {
      list.next()
      return value
    }
  }
}
