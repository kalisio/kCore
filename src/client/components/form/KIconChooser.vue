<template>
  <q-modal ref="dialog">
    <div class="row justify-center sm-gutter" style="max-width: 60vw; padding:24px">
      <template v-for="(icon, index) in icons">
        <div :key="index" class="col-1">
          <q-icon :key="index" v-if="icon !== selectedIcon" :name="icon" size="2rem" @click="onIconSelected(icon)"/>
          <q-icon :key="index" v-if="icon === selectedIcon" :name="selectedIcon" size="2rem" color="primary"/>
        </div>
      </template>
    </div>
  </q-modal>
</template>

<script>
import { QIcon, QModal } from 'quasar'
import yaml from 'js-yaml'

export default {
  name: 'k-icon-chooser',
  components: {
    QIcon,
    QModal
  },
  props: {
    iconSet: {
      type: String,
      default: 'material-icons'
    }
  },
  data () {
    return {
      icons: [],
      selectedIcon: 'edit'
    }
  },
  methods: {
    open (icon = 'label') {
      this.selectedIcon = icon
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    onIconSelected (icon) {
      this.selectedIcon = icon
      this.$emit('icon-selected', icon)
    }
  },
  created () {
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
        } catch (error) {
          throw new Error('Impossible to parse fontawesome code points: ' + error)
        }
      })
    }
  }
}
</script>
