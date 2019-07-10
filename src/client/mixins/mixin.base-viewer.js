import logger from 'loglevel'
import _ from 'lodash'

export default function baseViewerMixin (viewerRefs) {
  return {
    props: {
      baseObject: {
        type: Object,
        default: function () {
          return {}
        }
      },
      baseQuery: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      viewerTitle () {
        // Retuns the schema title
        if (this.getSchema()) {
          let schemaTitle = this.getSchema().title
          return this.$t(schemaTitle, { object: this.getObject() })
        }
        return ''
      }
    },
    methods: {
      fillViewer () {
        // Iterate over viewers
        viewerRefs.forEach(name => {
          let viewer = this.$refs[name]
          if (viewer.loadRefs().isFulfilled()) {
            if (this.getObject()) {
              if (this.perspective !== '') {
                viewer.fill(this.getObject()[this.perspective])
              } else {
                viewer.fill(this.getObject())
              }
            } else {
              viewer.clear()
            }
          } else {
            logger.warn(`Trying to fill the viewer with a non-ready view named ${name}`)
          }
        })
      },
      clear () {
        // Iterate over forms
        viewerRefs.forEach(name => {
          let viewer = this.$refs[name]
          if (viewer.loadRefs().isFulfilled()) {
            viewer.clear()
          } else {
            logger.warn(`Trying to clear the viewer with a non-ready view named ${name}`)
          }
        })
      },
      reset () {
        this.fillViewer()
      },
      getBaseObject () {
        // Start from default object or input base object
        // This is used to keep track of existing or additional "hidden" or "internal" properties
        // in addition to the ones edited throught the viewer
        let object = {}
        const baseObject = this.getObject() || this.baseObject
        if (this.perspective !== '') {
          Object.assign(object, _.get(baseObject, this.perspective))
          // Keep track of ID as it is used to know if we update or create
          if (baseObject._id) object._id = baseObject._id
        } else {
          Object.assign(object, baseObject)
        }
        return object
      },
      getBaseQuery () {
        // Start from default query
        let query = {}
        Object.assign(query, this.baseQuery)
        if ((this.getMode() === 'update') && (this.perspective !== '')) {
          Object.assign(query, { $select: ['_id', this.perspective] })
        }
        return query
      },
      refresh () {
        // When the service is available
        this.loadService()
        // We can then load the schema/object and local refs in parallel
        return Promise.all([
          this.loadSchema(),
          this.loadObject(),
          this.loadRefs()
        ])
        // We finally build the viewers then fill it
        .then(() => Promise.all(viewerRefs.map(name => this.$refs[name].build())))
        .then(() => {
          this.fillViewer()
          this.$emit('viewer-ready', this)
        })
      }
    }
  }
}
