import serviceMixin from './mixin.service'
import authenticationMixin from './authentication'
import collectionMixins from './collection'
import formMixins from './form'

export default {
  service: serviceMixin,
  authentication: authenticationMixin,
  collection: collectionMixins,
  form: formMixins
}
