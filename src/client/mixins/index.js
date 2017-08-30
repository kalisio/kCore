import authenticationMixin from './mixin.authentication'
import serviceMixin from './mixin.service'
import fieldMixin from './mixin.field'
import itemActionsMixin from './mixin.item-actions'

export default {
  authentication: authenticationMixin,
  service: serviceMixin,
  field: fieldMixin,
  itemActions: itemActionsMixin
}
