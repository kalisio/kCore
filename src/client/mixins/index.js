import serviceMixin from './mixin.service'
import fieldMixin from './mixin.field'
import authenticationMixin from './authentication'
import collectionMixins from './collection'

export default {
  service: serviceMixin,
  authentication: authenticationMixin,
  collection: collectionMixins,
  field: fieldMixin
}
