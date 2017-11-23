/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
export function createQuerablePromise(promiseOrExecutor) {
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
  );

  result.isFulfilled = () => { return isFulfilled }
  result.isPending = () => { return isPending }
  result.isRejected = () => { return isRejected }

  return result
}
