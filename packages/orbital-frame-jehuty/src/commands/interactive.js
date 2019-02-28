function interactive ({ interactionService, listenerService }) {
  return {
    name: 'interactive',
    description: 'Testing interactive commands',
    // format ({ name, age }) {
    //   return `Name: ${name}, Age: ${age}`
    // },
    async execute (args, opts) {
      const pid = this.pid // PID is added when this definition is wrapped and is only available to execute
      console.log('Have PID', pid)
      // const interaction = interactionService.getInteractionChannel(pid)

      // // TODO: this stuff probably needs to take place in a separate interaction function
      // const name = await interaction.prompt('What is your name?')
      // const age = await interaction.prompt('What is your age?')

      // return { name, age }
    }
  }
}

export default interactive
