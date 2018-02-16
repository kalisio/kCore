<template>
  <div :class="layout()">
    <q-card >
      <!--
        Title section
      -->
      <slot name="card-title"> 
        <div v-if="options.avatar">
          <q-card-media>
            <div class="row justify-center" style="padding:8px">
              <avatar v-if="name" :username="name" :size="options.avatar.size" />
            </div>
            <q-card-title slot="overlay">
              {{name}}
              <div slot="subtitle">
                <k-text-area :text="description" />
              </div>
              <div slot="right">
                <slot name="card-icon"></slot>
              </div>
            </q-card-title>
          </q-card-media>
        </div>
        <div v-else>
          <q-card-title>
            {{name}}
            <div slot="subtitle">
              <k-text-area :text="description" />
            </div>
            <div slot="right">
              <slot name="card-icon"></slot>
            </div>
          </q-card-title>
        </div>
      </slot>
      <!--
        Content section
      -->
      <q-card-main>
        <slot nanem="card-tags">
          <div v-if="tags && tags.length > 0">
            <div class="row justify-start items-center">
              <template v-for="tag in tags">
                <q-chip v-if="options.tags && options.tags === 'chip'" :key="key(tag, 'value')" small :color="tag.icon.color" :icon="tag.icon.name" class="tag">
                  {{tag.value}}
                </q-chip>
                <q-icon v-else :key="key(tag, 'value')" size="24px" :color="tag.icon.color" class="tag" :name="tag.icon.name">
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
            <q-btn :key="key(action, 'name')" flat round small :color="action.warning ? 'red' : 'faded'" @click="onActionTriggered(action, item)">
              <q-icon :name="action.icon"/>
              <q-tooltip>{{action.warning ? action.warning : action.label}}</q-tooltip>
            </q-btn>
          </template>
          <!-- Menu -->
          <q-btn v-if="itemActions.menu && itemActions.menu.length > 0" flat small round>
            <q-icon color="faded" name="more_vert">
              <q-popover ref="menu">
                <q-list>
                  <template v-for="action in itemActions.menu">
                    <q-item link :key="key(action, 'name')" @click="$refs.menu.close(); onActionTriggered(action, item)">
                      <q-item-side :icon="action.icon" />
                      <q-item-main>
                        {{action.label}}
                      </q-item-main>
                    </q-item>
                  </template>
                </q-list>
              </q-popover>
            </q-icon>
          </q-btn>
        </q-card-actions>
      </slot>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QCardMedia, QBtn, QIcon, QPopover, QList, QItem, QItemSide, QItemMain, QTooltip, QChip } from 'quasar'
import Avatar from 'vue-avatar/dist/Avatar'
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
      required: true
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
      return (this.options.tagsField ? _.get(this.item, this.options.tagsField, '') : this.item.tags)
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
      // If a route is given activate it with item ID
      else if (action.route) {
        let route = _.merge({ params: { id: item._id } }, action.route)
        this.$router.push(route)
      }
    }
  }
}
</script>

<style>
.tag {
  margin: 8px;
}
</style>