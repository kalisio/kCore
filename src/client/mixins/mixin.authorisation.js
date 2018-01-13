import logger from 'loglevel'
import { Events } from 'quasar'
import { Store } from '../store'
import { defineAbilities } from '../../common/permissions'

let authorisationMixin = {
  methods: {
    updateAbilities () {
      const user = Store.get('user')
      let abilities
      if (user) {
        abilities = defineAbilities(user)
        Store.set('user.abilities', abilities)
      }
      if (abilities) {
        logger.debug('New user abilities: ', abilities.rules)
      }
      return abilities
    }
  },
  created () {
    // Check if abilities are already computed
    let abilities = Store.get('user.abilities')
    if (!abilities) {
      // Otherwise try to compute them
      this.updateAbilities()
    }
    // Whenever the user is updated, update abilities as well
    Events.$on('user-changed', this.updateAbilities)
  },
  beforeDestroy () {
    Events.$off('user-changed', this.updateAbilities)
  }
}

Store.set('mixins.authorisation', authorisationMixin)

export default authorisationMixin
