<template>
  <k-modal ref="modal" :toolbar="getToolbar()" :buttons="getButtons()">
    <div slot="modal-content">
      <div class="column q-gutter-sm">
        <div class="row justify-between">
          <q-input
            v-model="searchQuery"
            :label="$t('KIconChooser.SEARCH_FIELD_LABEL')"
            clearable
            class="col-7" 
            dense />
          <q-select
            v-if="categories"
            :label="$t('KIconChooser.SEARCH_CATEGORY_LABEL')"
            :options="categories"
            :value="selectedCategory"
            @input="onSelectCategory"
            emit-value
            map-options
            clearable
            class="col-4" 
            dense />
        </div>
        <div class="row justify-start items-center q-gutter-sm">
          <template v-for="icon in iconsPage">
            <q-icon
              :key="icon.name"
              :color="icon.name !== selectedIcon.name ? 'grey-7' : selectedIcon.color"
              :name="icon.name"
              size="2rem"
              @click="onIconSelected(icon)">

              <q-tooltip>
                {{icon.title}}
              </q-tooltip>
            </q-icon>
          </template>
        </div>
        <div class="row justify-center items-center q-gutter-sm">
          <q-pagination v-model="currentPage" :max="maxPage" />
        </div>
        <div class="row justify-between items-center q-gutter-sm">
          <k-palette shape="round" v-model="selectedIcon.color" />
        </div>

        <!--For debug purpose only 
        <div class="row justify-start items-center q-gutter-sm">
          <span class="text-bold">Selected:</span> &nbsp;{{iconSelected() ? selectedIcon.name : '-'}}
        </div>
        -->
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
  data () {
    return {
      allIcons: [],
      searchQuery: '',
      categories: null,
      categoryInfos: null,
      selectedCategory: '',
      filteredIcons: [],
      filteringDone: false,
      currentPage: 1,
      iconsPerPage: 70,
      selectedIcon: {
        name: '',
        color: 'dark'
      }
    }
  },
  computed: {
    icons () {
      // Return a filtered or unfiltered list of icons (depending on whether a filter was applied)
      if (this.shouldFilter()) {
        if (!this.filteringDone) {
          this.filteredIcons = this.buildFilter()
          this.filteringDone = true
        }
      } else {
        this.filteredIcons = []
        this.filteringDone = false
      }

      // If we performed filtering then return the filtered list, otherwise the complete list
      return this.filteringDone ? this.filteredIcons : this.allIcons
    },
    maxPage () {
      return Math.ceil(this.icons.length / this.iconsPerPage)
    },
    iconsPage () {
      let firstIndex = (this.currentPage - 1) * this.iconsPerPage
      let lastIndex = Math.min(this.currentPage * this.iconsPerPage, this.icons.length)

      return this.icons.slice(firstIndex, lastIndex)
    }
  },
  watch: {
    searchQuery: function () {
      this.doFilter()
    }
  },
  methods: {
    doFilter: _.debounce(function () {
      // Trigger filtering
      this.filteringDone = false
    }, 500),
    shouldFilter () {
      const query = this.searchQuery || ''
      return query.trim().length > 1 || this.selectedCategory !== ''
    },
    buildFilter () {
      // Reset the selected icon because it might fall outside of the filtered icons; same for current page
      this.resetSelectedIcon()
      this.currentPage = 1

      let selectedIcons = this.allIcons

      if (this.selectedCategory && this.selectedCategory !== '') {
        selectedIcons = this.getIconsForCategory(this.selectedCategory)
      }

      let query = this.searchQuery || ''
      query = query.trim().toLowerCase()

      selectedIcons = selectedIcons.filter(icon => icon.title.toLowerCase().includes(query))

      return selectedIcons
    },
    getIconsForCategory (category) {
      const categoryIcons = this.categoryInfos[this.selectedCategory].icons
      const icons = []

      for (let categoryIcon of categoryIcons) {
        const icon = this.allIcons.find((e) => e.title === categoryIcon)

        if (icon) {
          icons.push(icon)
        }
      }

      return icons
    },
    onSelectCategory (value) {
      this.selectedCategory = value
      // Trigger filtering
      this.filteringDone = false
    },
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
    open (defaultIcon, defaultColor) {
      this.reset()

      // Find the page that contains the current selected icon
      let index = -1

      // Assign the selected icon to the default one if any
      if (defaultIcon) {
        Object.assign(this.selectedIcon, {name: defaultIcon, color: defaultColor})
        index = _.findIndex(this.allIcons, icon => { return icon.name === this.selectedIcon.name })
      }

      if (index === -1) this.currentPage = 1
      else this.currentPage = Math.ceil(index / this.iconsPerPage)

      // Open the modal
      this.$refs.modal.open()
    },
    reset () {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.filteredIcons = []
      this.filteringDone = false
      this.currentPage = 1
      this.resetSelectedIcon()
    },
    iconSelected () {
      return this.selectedIcon.name.length > 0
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
      if (this.selectedIcon.name === icon.name) {
        this.resetSelectedIcon()
      } else {
        this.selectedIcon.name = icon.name
      }
    },
    resetSelectedIcon () {
      this.selectedIcon.name = ''
      this.selectedIcon.color = 'dark'
    },
    async loadMaterialIcons () {
      // Fetch available material icons from the google repository so we are always in sync
      const response = await fetch('https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints')

      if (response.status !== 200) throw new Error('Impossible to retrieve material-icons code points: ' + response.status)
      const text = await response.text()

      // We have a list with on each new line 'icon_name icon-code' so we need to filter the codes
      // (there was also an 'empty' entry in the list so additionally we filter on iconName !== "")
      let icons = text.split(/\s+/).filter((iconName, index) => index % 2 === 0 && iconName !== '')

      if (icons.length === 0) throw new Error('Impossible to parse material-icons code points')
      icons.sort()

      icons = icons.map(icon => {
        return {name: icon, title: icon}
      })

      return { icons, categories: null, categoryInfos: null }
    },
    async loadFontAwesomeIcons () {
      // Fetch available FA icons from the font awesome repository so we are always in sync
      const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.yml')

      if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
      const text = await response.text()

      try {
        const icons = []

        let yamlCodes = yaml.safeLoad(text)
        _.forOwn(yamlCodes, (value, key) => {
          this.addFontAwsomeIcons(icons, value, key)
        })

        const categoryInfos = await this.loadFontAwesomeCategories()
        const categories = Object.keys(categoryInfos)

        if (icons.length === 0) throw new Error('Impossible to parse fontawesome code points')

        return { icons, categoryInfos, categories }
      } catch (error) {
        throw new Error('Impossible to parse fontawesome categories: ' + error)
      }
    },
    async loadFontAwesomeCategories () {
      const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/categories.yml')

      if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome categories: ' + response.status)
      const text = await response.text()

      try {
        const yamlCodes = yaml.safeLoad(text)

        return yamlCodes
      } catch (error) {
        throw new Error('Impossible to parse fontawesome categories: ' + error)
      }
    },
    addFontAwsomeIcons (list, value, key) {
      if (!value.styles) {
        this.addFontAwsomeIcon(list, key, 'fa-' + key)
      } else {
        if (value.styles.includes('brands')) {
          this.addFontAwsomeIcon(list, key, 'fab fa-' + key)
        } else {
          if (value.styles.includes('regular')) {
            this.addFontAwsomeIcon(list, key, 'far fa-' + key)
          }
          if (value.styles.includes('solid')) {
            this.addFontAwsomeIcon(list, key, 'fas fa-' + key)
          }
          if (value.styles.includes('light')) {
            this.addFontAwsomeIcon(list, key, 'fal fa-' + key)
          }
        }
      }
    },
    addFontAwsomeIcon (list, key, icon) {
      list.push({name: icon, title: key})
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-palette'] = this.$load('input/KPalette')

    // Load the icons set
    let result

    if (this.iconSet === 'material-icons') {
      result = await this.loadMaterialIcons()
    } else if (this.iconSet === 'fontawesome') {
      result = await this.loadFontAwesomeIcons()
    }

    this.allIcons = result.icons
    this.categories = result.categories
    this.categoryInfos = result.categoryInfos
  }
}
</script>
