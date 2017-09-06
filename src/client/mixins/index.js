import item from './mixin.item'
import activity from './mixin.activity'
import authenticationMixin from './mixin.authentication'
import serviceMixin from './mixin.service'
import fieldMixin from './mixin.field'
import itemActionsMixin from './mixin.item-actions'

export default {
  item,
  activity,
  authentication: authenticationMixin,
  service: serviceMixin,
  field: fieldMixin,
  itemActions: itemActionsMixin
}
