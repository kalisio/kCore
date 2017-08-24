import authenticationMixin from './mixin.authentication'
import serviceMixin from './mixin.service'
import fieldMixin from './mixin.field'
import collectionMixins from './collection'

export default {
  authentication: authenticationMixin,
  service: serviceMixin,
  collection: collectionMixins,
  field: fieldMixin
}
