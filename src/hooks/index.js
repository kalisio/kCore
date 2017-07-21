import { marshallComparisonQuery, marshallGeometryQuery } from './query'
import { log } from './logger'
import { processUserProfile } from './provider'

let hooks = {
  log,
  processUserProfile,
  marshallComparisonQuery,
  marshallGeometryQuery
}

export default hooks
