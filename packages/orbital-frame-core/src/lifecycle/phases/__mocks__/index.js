export const phase1 = jest.fn(services => next => args => {
  console.log('Calling phase1!')
  next(args)
})
export const phase2 = jest.fn(services => next => args => next(args))
export const phase3 = jest.fn(services => next => args => next(args))

export default [
  phase1,
  phase2,
  phase3
]
