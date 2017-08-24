import authenticationMixin from './mixin.authentication'
import serviceMixin from './mixin.service'
import fieldMixin from './mixin.field'
import createItemMixin from './mixin.create-item'
import editItemMixin from './mixin.edit-item'
import deleteItemMixin from './mixin.delete-item'

export default {
  authentication: authenticationMixin,
  service: serviceMixin,
  createItem: createItemMixin,
  editItem: editItemMixin,
  deleteItem: deleteItemMixin,
  field: fieldMixin
}
