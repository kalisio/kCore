import { marshallComparisonQuery, marshallGeometryQuery } from './query'
import { log } from './logger'
import { processUserProfile } from './provider'
import { processPerspectives } from './model'

let hooks = {
  log,
  processUserProfile,
  processPerspectives,
  marshallComparisonQuery,
  marshallGeometryQuery
}

export default hooks
