import logger from 'loglevel'
import { Platform, Toast } from 'quasar'
import { Store } from './store'

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far

// FIXME: we don't build vue component anymore, they are processed by webpack in the application template
// export * from './components'

export * from './api'
export * from './store'
export * from './guards'
export * as mixins from './mixins'
export * as hooks from './hooks'

export default function init () {
  const app = this

  // Listen to the 'patched' event on the users
  const users = app.getService('users')
  users.on('patched', user => {
    // Check whether we need to update the current user
    if (user._id === Store.get('user._id')) {
      Store.patch('user', user)
    }
  })

  logger.debug('Initializing kalisio core')

  // -----------------------------------------------------------------------
  // | After this we should only have specific cordova initialisation code |
  // -----------------------------------------------------------------------
  if (!Platform.is.cordova) return

  document.addEventListener('deviceready', _ => {
    let notifier = PushNotification.init({
      android: { vibrate: true, sound: true, forceShow: true },
      ios: { alert: true, badge: true, sound: true },
      windows: { }
    })
    notifier.on('registration', (data) => {
      logger.debug('Registered device with ID ' + data.registrationId)
      window.device.registrationId = data.registrationId
    })
    notifier.on('notification', (data) => {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
    })
    notifier.on('error', (error) => {
      logger.error(error)
      Toast.create.negative({
        html: error.message,
        timeout: 10000
      })
    })
  }, false)
}
