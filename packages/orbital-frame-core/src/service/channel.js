import search from '../util/search'

const channel = frame => () => {
  const list = async () => await frame.getChannels()
  const { find, findOne } = search(list)

  return {
    find,
    findOne,
    list
  }
}

export default channel
