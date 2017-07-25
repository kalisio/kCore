import makeDebug from 'debug'
import services from './services'
// A shorter version of all of this should be the following
/*
export * as hooks from './hooks'
export * from './service'
export * from './db'
*/
// However for now we face a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
import { log, processUserProfile, processPerspectives, marshallGeometryQuery, marshallComparisonQuery } from './hooks'
import kaelia from './application'
export let hooks = { log, processUserProfile, processPerspectives, marshallComparisonQuery, marshallGeometryQuery }
export { kaelia }
export { Database } from './db'

const debug = makeDebug('kaelia:kCore')

export default function init () {
  const app = this

  debug('Initializing kaelia')
  app.configure(services)
}
