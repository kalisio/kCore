<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="buttons" :options="{ padding: '4px', minWidth: '50vw', maxWidth: '55vw' }">
    <div slot="modal-content" class="column sm-gutter"">
      <div class="row justify-center items-center sm-gutter">
        <template v-for="icon in iconsPage">
          <q-icon class="col-1" style="margin:4px" :key="icon" v-if="icon !== selectedIcon" :name="icon" size="2rem" color="faded" @click="onIconSelected(icon)" />
          <q-icon class="col-1" style="margin:4px" :key="icon" v-else :name="icon" size="2rem" :color="selectedColor" />
        </template>
      </div>
      <div class="row justify-center items-center">
        <q-pagination v-model="currentPage" :max="maxPage" />
      </div>
      <div class="row justify-between items-center">
        <k-palette shape="round" v-model="selectedColor" />
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
      default: 'material-icons'
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
      iconsPerPage: 72,
      maxPage: 1,
      icons: [],
      selectedIcon: '',
      selectedColor: 'dark',
      toolbar: [
        { name: 'Close', icon: 'close', handler: () => this.doClose() }
      ],
      buttons: [
        { name: 'Done', color: 'primary', handler: (event, done) => this.doDone(event, done) }
      ],
    }
  },
  methods: {
    open (name, color) {
      this.selectedIcon = name
      this.selectedColor = color
      let index = _.findIndex(this.icons,(icon) => { return icon === name })
      if (index === -1) this.currentPage = 1
      else this.currentPage = Math.ceil(index / this.iconsPerPage)
      this.$refs.modal.open()
    },
    doDone (event, done) {
      this.$emit('icon-choosed', { name: this.selectedIcon, color: this.selectedColor })
      done()
      this.doClose()
    },
    doClose (event, done) {
      this.$refs.modal.close()
    },
    onIconSelected (icon) {
      this.selectedIcon = icon
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
      // Fetch available material icons from the google repository so we are always in sync
      fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/src/icons.yml')
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
        }
        return response.text()
      })
      .then(text => {
        try {
          let yamlCodes = yaml.safeLoad(text).icons
          // We have a list with on each entry 'name id ...' so we need to filter the codes
          if (yamlCodes && yamlCodes.length > 0 ) {
            // Add also prefix for quasar
            this.icons = yamlCodes.map(icon => 'fa-' + icon.id)
          }
          if (this.icons.length === 0) {
            throw new Error('Impossible to parse fontawesome code points')
          }
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
