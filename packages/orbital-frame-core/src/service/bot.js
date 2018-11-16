import serviceHost from './host'

export default {
  async getName () {
    return await axios.get('/bot/name')
  }
}
