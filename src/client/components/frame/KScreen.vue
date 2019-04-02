<template>
  <div class="row justify-center items-center window-height window-width">
     <!--
       Header section
      -->
    <div class="col-12 self-start">
      <k-screen-header class="screen-header" />
    </div>
     <!--
       Content section
      -->
    <div class="screen-frame">
      <!-- Banner -->
      <slot name="screen-banner">
        <div v-if="banner" class="row justify-center">
          <img class="screen-banner" :src="banner">
        </div>
      </slot>
      <!-- Frame -->
      <q-card>
        <q-card-section>
          <!-- Title -->
          <slot name="screen-title">
            {{ title }}
          </slot>
        </q-card-section>
        <q-card-section>
          <div class="col">
            <!-- Content -->
            <slot name="screen-content" />
            <!-- links -->
            <slot name="screen-links">
              <div class="row justify-center xs-gutter screen-links">
                <template v-for="link in links">
                  <a class="link" :id="link.id" :key="link.id" @click="$router.push(link.route)">
                    {{ $t(link.label) }}
                  </a>
                </template>
              </div>
            </slot>
          </div>
        </q-card-section>
      </q-card>
      <!-- Extra links -->
      <slot name="screen-extra-links">
        <small>
          <div class="row justify-center xs-gutter">
            <template v-for="link in extraLinks">
              <a class="link" :key="link.label" @click="onLinkClicked(link)">
                {{ $t(link.label) }}
              </a>
            </template>
          </div>
        </small>
      </slot>
    </div>
     <!--
      Footer section
      -->
    <div class="col-12 self-end">
      <k-screen-footer class="screen-footer" />
    </div>
  </div>
</template>

<script>
import { QCard, QCardSection, openURL } from 'quasar'

export default {
  name: 'k-screen',
  components: {
    QCard,
    QCardSection
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    links: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      banner: null,
      extraLinks: []
    }
  },
  methods: {
    onLinkClicked (link) {
      if (link.url) {
        openURL(link.url)
      } else if (link.route) {
        this.$router.push(link.route)
      }
    }
  },
  created () {
    // Configure this screen
    this.banner = this.$load(this.$config('screens.banner', 'kalisio-banner.png'), 'asset')
    this.extraLinks = this.$config('screens.extraLinks', [])
    // load the required components
    this.$options.components['k-screen-header'] = this.$load('frame/KScreenHeader')
    this.$options.components['k-screen-footer'] = this.$load('frame/KScreenFooter')
  }
}
</script>

<style>
  .screen-header {
    padding: 8px;
  }
  .screen-banner {
    max-width: 270px;
    max-height: 80px;
    width: auto;
    height: auto;
  }
  .screen-frame {
    width: 540px;
  }
  .screen-links {
    margin-top: 16px;
  }
  .screen-footer {
    padding: 8px;
  }
</style>