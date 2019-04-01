export const phase1 = jest.fn((services, next, args) => {
  next('phase1')
})

export const phase2 = jest.fn((services, next, args) => {
  next(`${args} phase2`)
})

export const phase3 = jest.fn((services, next, args) => {
  next(`${args} phase3`)
})

export default {
  phase1: {
    call: services => next => args => phase1(services, next, args)
  },
  phase2: {
    call: services => next => args => phase2(services, next, args)
  },
  phase3: {
    call: services => next => args => phase3(services, next, args)
  }
}
