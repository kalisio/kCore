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
              <span slot="subtitle">{{description}}</span>
              <div slot="right">
                <slot name="card-icon"></slot>
              </div>
            </q-card-title>
          </q-card-media>
        </div>
        <div v-else>
          <q-card-title slot="overlay">
            {{name}}
            <span slot="subtitle">{{description}}</span>
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
                <q-chip v-if="options.tags && options.tags === 'chip'" :key="key(tag, 'value')" small color="tertiary" :icon="tag.icon" class="tag">
                  {{tag.value}}
                </q-chip>
                <q-icon v-else :key="key(tag, 'value')" size="24px" color="tertiary" class="tag" :name="tag.icon">
                  <q-tooltip>{{tag.value}}</q-tooltip>
                </q-icon>
              </template>
              <q-btn v-if="hasTagsAction" flat small round @click="onActionTriggered(tagsAction(), item)">
                <q-icon name="local_offer" color="primary" />
              </q-btn>
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
          <template v-for="action in paneActions">
            <q-btn :key="key(action, 'name')" flat round small color="faded" @click="onActionTriggered(action, item)">
              <q-icon :name="action.icon" />
              <q-tooltip>{{action.label}}</q-tooltip>
            </q-btn>
          </template>
          <!-- Menu -->
          <q-btn v-if="menuActions.length > 0" flat small round>
            <q-icon color="faded" name="more_vert">
              <q-popover ref="menu">
                <q-list>
                  <template v-for="action in menuActions">
                    <q-item link :key="key(action, 'name')" @click="onActionTriggered(action, item);">
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
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem],
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
    Avatar
  },
  computed: {
    hasTagsAction () {
      return ! _.isUndefined(this.tagsAction())
    },
    paneActions () {
      return this.permittedActions.filter(action => {
        return action.scope && action.scope === 'pane'
      })
    },
    menuActions () {
      return this.permittedActions.filter(action => {
        return action.scope && action.scope === 'menu'
      })
    },
  },
  watch: {

  },
  
  methods: {
    tagsAction () {
      return _.find(this.actions, {name: 'tags'})
    },
    layout () {
      return _.get(this.options, 'layout', 'col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-3')
    },
    key (object, property) {
      return this.item._id + '-' + object[property]
    }
  }
}
</script>

<style>
.tag {
  margin: 8px;
}
</style>