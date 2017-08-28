import logger from 'loglevel'
import { Store } from './store'

// Guards that can be added to customize route guards
let guards = []

// A gard should return true to authorize navigation,
// false to reset navigation to previous route,
// a name to jump to a given route

// Guard unauthenticated users
export function authenticationGuard (user, to, from, next) {
  // All routes under /home are assumed to be authenticated
  if (to.path.startsWith('/home')) {
    // If the user is here then he is authenticated
    if (user) {
      return true
    } else {
      return 'login'
    }
  } else {
    return true
  }
}

// Guard routes for a given user
export function beforeGuard (to, from, next) {
  const user = Store.get('user')
  // Run registered guards
  guards.forEach(guard => {
    let result = guard(user, to, from, next)
    if (typeof result === 'string') {
      logger.debug('Navigation guard redirected to route ' + result)
      next({ name: result })
    } else if (!result) {
      logger.debug('Navigation aborted by guard')
      next(false)
    }
  })

  logger.debug('Navigation guards passed')
  next()
}

beforeGuard.registerGuard = function (guard) {
  if (!guards.includes(guard)) {
    guards.push(guard)
  }
}

beforeGuard.unregisterGuard = function (guard) {
  guards = guards.filter(registeredGuard => registeredGuard !== guard)
}

