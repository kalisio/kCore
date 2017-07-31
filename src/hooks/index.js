import { marshallComparisonQuery, marshallGeometryQuery, populateObject, populateObjects } from './query'
import { log } from './logger'
import { processUserProfile } from './provider'
import { processPerspectives } from './model'

let hooks = {
  log,
  processUserProfile,
  processPerspectives,
  marshallComparisonQuery,
  marshallGeometryQuery,
  populateObject,
  populateObjects
}

export default hooks
