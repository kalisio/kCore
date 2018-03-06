/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
export function createQuerablePromise (promiseOrExecutor) {
  let promise = promiseOrExecutor
  if (typeof promiseOrExecutor === 'function') {
    promise = new Promise(promiseOrExecutor)
  }
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise

  // Set initial state
  let isPending = true
  let isRejected = false
  let isFulfilled = false

  // Observe the promise, saving the fulfillment in a closure scope.
  let result = promise.then(
    (value) => {
      isFulfilled = true
      isPending = false
      return value
    },
    (error) => {
      isRejected = true
      isPending = false
      throw error
    }
  )

  result.isFulfilled = () => { return isFulfilled }
  result.isPending = () => { return isPending }
  result.isRejected = () => { return isRejected }

  return result
}

export const Colors = {
  'dark': '#333',
  'red': '#f44336',
  'pink': '#e91e63',
  'purple': '#9c27b0',
  'deep-purple': '#673ab7',
  'indigo': '#3f51b5',
  'blue': '#2196f3',
  'light-blue': '#03a9f4',
  'cyan': '#00bcd4',
  'teal': '#009688',
  'green': '#4caf50',
  'light-green': '#8bc34a',
  'lime': '#cddc39',
  'yellow': '#ffeb3b',
  'amber': '#ffc107',
  'orange': '#ff9800',
  'deep-orange': '#ff5722',
  'brown': '#795548',
  'grey': '#9e9e9e',
  'blue-grey': '#607d8b'
}

export function getLocale () {
  let locale =
    navigator.language ||
    navigator.languages[0] ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage

  if (locale) {
    return locale.toLowerCase()
  }
  // return undefined by default
}
