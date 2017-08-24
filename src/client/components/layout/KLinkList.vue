<template>
  <!--q-list highlight no-border-->
  <div>
    <template v-for="link in links">
      <q-side-link v-if="link.label" item 
        :to="{name: link.route}" 
        :exact="link.exact ? true : false"
        :replace="link.replace ? true: false"
        :append="link.append ? true:false">
        <q-item-side :icon="link.icon" />
        <q-item-main :label="link.label" />
      </q-side-link>
      <q-item-separator v-else />
    </template>    
  <!--/q-list-->
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { QItemSide, QItemMain, QSideLink, QItemSeparator } from 'quasar'

export default {
  name: 'k-link-list',
  components: {
    QItemSide,
    QItemMain,
    QSideLink,
    QItemSeparator,
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    links () {
      if (! _.isEmpty(this.data)) {
        return this.data
      }
      if (! _.isNull(this.object)) {
        let result = []
        if (this.object[this.property]) {
          this.object[this.property].forEach(item => {
            // TODO: enhance the mapping between the observed property and the links
            let link = {}
            link.label = item.name
            link.route = this.property
            result.push(link)
          })
        }
        return result
      }
      return []
    }
  },
  data () {
    return {
      data: [],
      object: null
    }
  },
  created () {
    // Load the configuration
    let confPath = 'config.' + this.name
    let data = this.$store.get(confPath + '.data')
    if (data) {
      if (_.isArray(data)) {
        this.data = data
      }
      else if(_.isString(data)) {
        this.property = _.last(_.split(data, '.'))
        this.path = _.replace(data, '.' + this.property, '')
        this.object = this.$store.get(this.path, null)
      }
      else {
        logger.warn('created(): invalid data value')
      }
    }
  }
}
</script>
