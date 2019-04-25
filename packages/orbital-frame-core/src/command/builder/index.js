import pipelineBuilder from './pipelineBuilder'
import assignmentBuilder from './assignmentBuilder'
import type from '../metadata/types'
import cyclicIncrementor from '../../util/cyclicIncrementor'
import { isFunction } from 'lodash'

const pidGenerator = cyclicIncrementor(1)

function builder (commandRegistry, environment) {
  const pid = pidGenerator.next()
  const context = { commandRegistry, environment, pid }
  const pipelines = []
  const assignments = []

  return {
    addPipeline () {
      const builder = pipelineBuilder(context)
      pipelines.push(builder)

      return builder
    },

    addVariable (key) {
      const builder = assignmentBuilder(key)
      assignments.push(builder)

      return builder
    },

    getMetadata () {
      return {
        [type.PROGRAM]: {
          assignments: assignments.map(assignment => assignment.getMetadata()),
          pipelines: pipelines.map(pipeline => pipeline.getMetadata())
        }
      }
    },

    build () {
      const process = async (args, opts) => {
        await Promise.all(assignments
          .map(assignment => assignment.build())
          .map(async ([ key, value ]) => {
            const execVal = isFunction(value) ? await value() : value
            environment.set(key, execVal)
          })
        )

        return await Promise.all(pipelines.map(async pipeline => {
          const pipelineOutput = pipeline.build()
          return await pipelineOutput(args, opts)
        }))
      }

      process.pid = pid
      return process
    }
  }
}

export default builder
