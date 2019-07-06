<template>
  <k-modal ref="modal" :toolbar="getToolbar()" :buttons="getButtons()" :options="{ padding: '4px', width: '600px' }">
    <div slot="modal-content" class="column q-gutter-sm">
      <div class="row justify-center items-center q-gutter-sm">
        <template v-for="icon in iconsPage">
          <q-icon class="col-1" style="margin:4px" :key="icon" :color="icon !== selectedIcon.name ? 'grey-7' : selectedIcon.color" :name="icon" size="2rem" @click="onIconSelected(icon)" />
        </template>
      </div>
      <div class="row justify-center items-center">
        <q-pagination v-model="currentPage" :max="maxPage" />
      </div>
      <div class="row justify-between items-center">
        <k-palette shape="round" v-model="selectedIcon.color" />
      </div>
    </div>
  </k-modal>
</template>

<script>
import { QIcon, QPagination } from 'quasar'
import yaml from 'js-yaml'
import _ from 'lodash'

export default {
  name: 'k-icon-chooser',
  components: {
    QIcon,
    QPagination
  },
  props: {
    iconSet: {
      type: String,
      default: 'fontawesome'
    }
  },
  computed: {
    iconsPage () {
      let firstIndex = (this.currentPage - 1) * this.iconsPerPage
      let lastIndex = Math.min(this.currentPage * this.iconsPerPage, this.icons.length)
      return this.icons.slice(firstIndex, lastIndex)
    }
  },
  data () {
    return {
      currentPage: 1,
      iconsPerPage: 70,
      maxPage: 1,
      icons: [],
      selectedIcon: {
        name: '',
        color: 'dark'
      }
    }
  },
  methods: {
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KIconChooser.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    getButtons () {
      return [
        { name: 'done-button', label: this.$t('KIconChooser.DONE_BUTTON'), color: 'primary', handler: (event) => this.doDone(event) }
      ]
    },
    open (defaultIcon) {
      // Assign the selected icon to the default one if any
      if (defaultIcon) Object.assign(this.selectedIcon, defaultIcon)
      // Find the page that contains the current selected icon
      let index = _.findIndex(this.icons, (i) => { return i === this.selectedIcon.name })
      if (index === -1) this.currentPage = 1
      else this.currentPage = Math.ceil(index / this.iconsPerPage)
      // Open the modal
      this.$refs.modal.open()
    },
    doDone (event) {
      this.$emit('icon-choosed', this.selectedIcon)
      this.doClose()
    },
    doClose (event) {
      this.$refs.modal.close()
    },
    onIconSelected (icon) {
      // When clicking again on the icon we remove it
      if (this.selectedIcon.name === icon) {
        this.selectedIcon.name = ''
      } else {
        this.selectedIcon.name = icon
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-palette'] = this.$load('input/KPalette')
    // Load the icons set
    if (this.iconSet === 'material-icons') {
      // Fetch available material icons from the google repository so we are always in sync
      fetch('https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints')
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Impossible to retrieve material-icons code points: ' + response.status)
        }
        return response.text()
      })
      .then(text => {
        // We have a list with on each new line 'icon_name icon-code' so we need to filter the codes
        this.icons = text.split(/\s+/).filter((iconName, index) => index % 2 === 0)
        if (this.icons.length === 0) {
          throw new Error('Impossible to parse material-icons code points')
        }
        this.icons.sort()
        this.maxPage = Math.ceil(this.icons.length / this.iconsPerPage)
      })
    } else if (this.iconSet === 'fontawesome') {
      // Fetch available FA icons from the font awesome repository so we are always in sync
      // FIXME: this code should work with FA v5 and new quasar version
      // fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/advanced-options/metadata/icons.yml')
      fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/fa-4/src/icons.yml')
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
        }
        return response.text()
      })
      .then(text => {
        try {
          // FA v4
          let yamlCodes = yaml.safeLoad(text).icons
          // We have a list with on each entry 'name id ...' so we need to filter the codes
          if (yamlCodes && yamlCodes.length > 0) {
            // Add also prefix for quasar
            this.icons = yamlCodes.map(icon => 'fa-' + icon.id)
          }
          /* FIXME: this code should work with FA v5 and new quasar version
          let yamlCodes = yaml.safeLoad(text)
          _.forOwn(yamlCodes, (value, key) => {
            if (!value.styles) {
              this.icons.push('fa-' + key)
            } else {
              if (value.styles.includes('brands')) {
                this.icons.push('fab fa-' + key)
              } else {
                if (value.styles.includes('regular')) {
                  this.icons.push('far fa-' + key)
                }
                if (value.styles.includes('solid')) {
                  this.icons.push('fas fa-' + key)
                }
                if (value.styles.includes('light')) {
                  this.icons.push('fal fa-' + key)
                }
              }
            }
          })
          */
          if (this.icons.length === 0) {
            throw new Error('Impossible to parse fontawesome code points')
          }
          // FIXME: FA v5 are already sorted, we should remove this when upgrading
          this.icons.sort()
          this.maxPage = Math.ceil(this.icons.length / this.iconsPerPage)
        } catch (error) {
          throw new Error('Impossible to parse fontawesome code points: ' + error)
        }
      })
    }
  }
}
</script>
