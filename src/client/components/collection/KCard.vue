<template>
  <div :class="layout()">
    <q-card >
      <!--
        Title section
      -->
      <slot name="card-title"> 
        <q-item>
          <q-item-side v-if="options.avatar">
            <avatar v-if="name" :username="name" :size="options.avatar.size" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>{{name}}</q-item-tile>
            <q-item-tile sublabel><small><k-text-area :length="20" :text="description" /></small></q-item-tile>
          </q-item-main>
          <q-item-side right>
            <slot name="card-icon"></slot>
          </q-item-side>
        </q-item>
        <q-card-separator />
      </slot>
      <!--
        Content section
      -->
      <q-card-main>
        <slot name="card-tags">
          <div v-if="tags && tags.length > 0">
            <div class="row justify-start items-center">
              <template v-for="tag in tags">
                <q-chip v-if="options.tags && options.tags === 'chip'" :key="key(tag, 'value')" small :color="tag.icon.color" :icon="tag.icon.name" class="card-tag-chip">
                  {{tag.value}}
                </q-chip>
                <q-icon v-else :key="key(tag, 'value')" size="24px" :color="tag.icon.color" class="card-tag-chip" :name="tag.icon.name">
                  <q-tooltip>{{tag.value}}</q-tooltip>
                </q-icon>
              </template>
            </div>
            <q-card-separator />
          </div>
        </slot>
        <slot name="card-content"></slot>
      </q-card-main>
      <!--
        Actions section
      -->
      <q-card-separator />
      <slot name="card-actions">
        <q-card-actions align="end">
          <!-- Pane -->
          <template v-for="action in itemActions.pane">
            <q-btn :id="action.name" :key="key(action, 'name')" flat round small :color="action.warning ? 'red' : 'grey-7'" @click="onActionTriggered(action, item)">
              <q-icon :name="action.icon"/>
              <q-tooltip>{{action.warning ? action.warning : action.label}}</q-tooltip>
            </q-btn>
          </template>
          <!-- Menu -->
          <q-btn id="card-overflow-menu-entry" v-if="itemActions.menu && itemActions.menu.length > 0" flat small round>
            <q-popover id="card-overflow-menu" ref="menu">
              <q-list>
                <template v-for="action in itemActions.menu">
                  <q-item :id="action.name" link :key="key(action, 'name')" @click="$refs.menu.close(); onActionTriggered(action, item)">
                    <q-item-side :icon="action.icon" />
                    <q-item-main>
                      {{action.label}}
                    </q-item-main>
                  </q-item>
                </template>
              </q-list>
            </q-popover>
            <q-icon color="grey-7" name="more_vert"></q-icon>
          </q-btn>
        </q-card-actions>
      </slot>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QCardMedia, QBtn, QIcon, QPopover, QList, QItem, QItemSide, QItemMain, QItemTile, QTooltip, QChip } from 'quasar'
import { Avatar } from 'vue-avatar'
import { KTextArea } from '../frame'

export default {
  name: 'k-card',
  components: {
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QCardMedia,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QBtn,
    QIcon,
    QPopover,
    QTooltip,
    QChip,
    Avatar,
    KTextArea
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    itemActions: {
      type: Object,
      default: function () {
        return {
          pane: [],
          menu: []
        }
      }
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    description () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    tags () {
      // Check for custom name field
      let tags = this.options.tagsField ? _.get(this.item, this.options.tagsField, '') : this.item.tags
      return _.filter(tags, { context: this.$store.get('context._id') })
    }
  },
  data () {
    return {
      descriptionTruncated: true,
      descriptionToggle: false
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3')
    },
    key (object, property) {
      return this.item._id + '-' + object[property]
    },
    onActionTriggered (action, item) {
      // If a handler is given call it
      if (action.handler) action.handler.call(this, item)
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>

<style>
.card-tag-chip {
  margin: 4px;
}
</style>