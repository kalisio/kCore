import authentication from './mixin.authentication'
import authorisation from './mixin.authorisation'
import baseActivity from './mixin.base-activity'
import baseCollection from './mixin.base-collection'
import baseEditor from './mixin.base-editor'
import baseItem from './mixin.base-item'
import baseField from './mixin.base-field'
import objectProxy from './mixin.object-proxy'
import schemaProxy from './mixin.schema-proxy'
import service from './mixin.service'
import refsResolver from './mixin.refs-resolver'

export default {
  authentication,
  authorisation,
  baseActivity,
  baseCollection,
  baseEditor,
  baseItem,
  baseField,
  objectProxy,
  schemaProxy,
  service,
  refsResolver
}
