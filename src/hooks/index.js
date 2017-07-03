import { marshallComparisonQuery, marshallGeometryQuery } from './query'
import { log } from './logger'

let hooks = {
  log,
  marshallComparisonQuery,
  marshallGeometryQuery
}

export default hooks
