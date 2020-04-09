function interactive ({ interactionService, configService }) {
  return {
    name: 'interactive',
    synopsis: 'interactive',
    description: `An example of an interactive command. To respond to this command, prepend your message with "${configService.ps2}".`,
    format ({ name, age, color }) {
      return `Name: ${name}, Age: ${age}, Favorite Color: ${color}`
    },
    async execute () {
      const interaction = await interactionService.createInteractionChannel()

      const { text: name } = await interaction.prompt('What is your name?')
      const { text: age } = await interaction.prompt('What is your age?')
      const { text: color } = await interaction.prompt('What is your favorite color?')

      return { name, age, color }
    }
  }
}

export default interactive
