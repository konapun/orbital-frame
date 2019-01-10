const start = () => next => () => {
  console.log('STARTING')
  next()
}

export default start
