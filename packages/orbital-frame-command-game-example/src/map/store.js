const items = [
  {
    name: 'sword',
    description: 'Just your typical sword',
    price: 100
  }
]

const location = {
  name: 'A store',
  description: 'Just your typical store'
}

const contributes = {
  purchase: {
    synonyms: [ 'buy' ],
    execute (args, { player }) {
      console.log('PURCHASING!', args)
    }
  }
}

export default {
  location,
  contributes
}
