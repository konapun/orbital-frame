import search from '../util/search'

const user = frame => () => {
  const list = async () => await frame.getUsers()
  const { find, findOne } = search(list)

  return {
    find,
    findOne,
    list
  }
}

export default user
