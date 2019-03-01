function interactive ({ interactionService }) {
  return {
    name: 'interactive',
    description: 'Testing interactive commands',
    format ({ name, age, color }) {
      return `Name: ${name}, Age: ${age}, Favorite Color: ${color}`
    },
    async execute () {
      const pid = this.pid
      const interaction = await interactionService.createInteractionChannel(pid)

      const name = await interaction.prompt('What is your name?')
      const age = await interaction.prompt('What is your age?')
      const color = await interaction.prompt('What is your favorite color?')

      return { name, age, color }
    }
  }
}

export default interactive
