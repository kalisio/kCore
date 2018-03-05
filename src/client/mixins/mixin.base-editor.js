import logger from 'loglevel'
import _ from 'lodash'

export default function baseEditorMixin (formRefs) {
  return {
    props: {
      baseObject: {
        type: Object,
        default: function () {
          return {}
        }
      },
      clearButton: {
        type: String,
        default: ''
      },
      resetButton: {
        type: String,
        default: ''
      }
    },
    computed: {
      editorTitle () {
        // Retuns the schema title
        if (this.getSchema()) {
          let schemaTitle = this.getSchema().title
          if (this.getMode() === 'create') return schemaTitle
          if (this.getObject()) return _.template(schemaTitle)({ object: this.getObject() })
        }
        return ''
      }
    },
    data () {
      return {
        applyButton: ''
      }
    },
    methods: {
      getMode () {
        if (this.id) return 'update'
        return 'create'
      },
      // Disabled forms will not be applied
      setFormDisabled (formName, disabled) {
        // Iterate over forms
        formRefs.forEach(name => {
          let form = this.$refs[name]
          if (name === formName) {
            if (form.loadRefs().isFulfilled()) {
              form.isDisabled = disabled
            } else {
              logger.warn(`Trying to disable in the editor a non-ready form named ${name}`)
            }
          }
        })
      },
      fillEditor () {
        // Iterate over forms
        formRefs.forEach(name => {
          let form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            if (this.getObject()) {
              if (this.perspective !== '') {
                form.fill(this.getObject()[this.perspective])
              } else {
                form.fill(this.getObject())
              }
            } else {
              form.clear()
            }
          } else {
            logger.warn(`Trying to fill the editor with a non-ready form named ${name}`)
          }
        })
        // Update button accordingly
        if (this.getMode() === 'update') {
          this.applyButton = 'Update'
        } else {
          this.applyButton = 'Create'
        }
      },
      clear () {
        // Iterate over forms
        formRefs.forEach(name => {
          let form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            form.clear()
          } else {
            logger.warn(`Trying to clear the editor with a non-ready form named ${name}`)
          }
        })
      },
      reset () {
        this.fillEditor()
      },
      async apply (event, done) {
        // Iterate over forms for validation
        let isValid = true
        formRefs.forEach(name => {
          let form = this.$refs[name]
          if (form.loadRefs().isFulfilled()) {
            if (!form.isDisabled) {
              let result = form.validate()
              if (!result.isValid) {
                isValid = false
              }
            }
          } else {
            logger.warn(`Trying to apply the editor with a non-ready form named ${name}`)
            isValid = false
          }
        })

        // Now the form is valid apply it to the target object
        // Start from default object or input base object
        // This is used to keep track of existing or additional "hidden" or "internal" properties
        // in addition to the ones edited throught the form
        let object = {}
        const baseObject = this.getObject() || this.baseObject
        if (this.perspective !== '') {
          Object.assign(object, _.get(baseObject, this.perspective))
        } else {
          Object.assign(object, baseObject)
        }

        if (isValid) {
          // Apply each form
          for (let i = 0; i < formRefs.length; i++) {
            const name = formRefs[i]
            let form = this.$refs[name]
            try {
              await form.apply(object)
            } catch (error) {
              isValid = false
              break
            }
          }
        }
        // Stop here if invalid or not applied correctly
        if (!isValid) {
          if (done) done()
          return
        }

        if (this.getService()) {
          // Small helper to avoid repeating too much similar code
          let onServiceResponse = response => {
            this.$emit('applied', response)
            if (done) done()
          }

          // Update the item
          if (this.applyButton === 'Update') {
            // Editing mode => patch the item
            if (this.perspective !== '') {
              let data = {}
              data[this.perspective] = object
              this.servicePatch(this.id, data, { query: { $select: [this.perspective] } })
              .then(onServiceResponse)
            } else {
              this.servicePatch(this.id, object)
              .then(onServiceResponse)
            }
          } else if (this.applyButton === 'Create') {
            // Creation mode => create the item
            this.serviceCreate(object)
            .then(onServiceResponse)
          } else {
            logger.warn('Invalid editor mode')
            if (done) done()
          }
        }
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
        // We finally build the forms then fill it
        .then(() => Promise.all(formRefs.map(name => this.$refs[name].build())))
        .then(() => this.fillEditor())
      }
    }
  }
}
