import { TooManyRequests } from 'feathers-errors'
import { RateLimiter } from 'limiter'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:service:hooks')

export function rateLimit (options) {
  const limiter = new RateLimiter(options.tokensPerInterval, options.interval)

  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'rateLimit' hook should only be used as a 'before' hook.`)
    }
    const operation = hook.method
    const service = hook.service.name
    let rateLimit = true
    if (options.operation && (options.operation !== operation)) {
      rateLimit = false
    }
    if (options.service && (options.service !== service)) {
      rateLimit = false
    }

    if (rateLimit) {
      debug(limiter.getTokensRemaining() + ' remaining token for rateLimit hook on service ' + service)
      if (!limiter.tryRemoveTokens(1)) { // if exceeded
        throw new TooManyRequests('Too many requests in a given amount of time (rate limiting) on service ' + service, { translation: { key: 'RATE_LIMITING' } })
      }
    }
    return hook
  }
}
