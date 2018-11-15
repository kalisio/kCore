<template>

  <div class="k-timecontroller-container">

    <div v-bind:style="pointerContainerStyle"
         class="k-interval-pointer-container"
    >
      <k-time-pointer
        :position="position"
        :time="currentValue"
        :timeInterval="timeInterval"
        :componentLeft="componentLeft"
        :componentWidth="componentWidth"        
        :pointerColor="pointerColor"
        :pointerTextColor="pointerTextColor"
        @change="onChangePosition"
      />
    </div>

    <div class="k-timecontroller-activebar" v-bind:style="activeBarStyle"></div>
    <div class="k-timecontroller-bar" v-bind:style="barStyle" ref="timeControllerBar">
      <q-resize-observable @resize="onResize" />
    </div>

    <div v-bind:style="tickContainerStyle"
         class="k-interval-ticks-container"
    >
      <k-time-interval
        v-for="timeInterval in timeIntervals" :key="timeInterval.value"
        :color="color"
        :timeInterval="timeInterval"
        :intervalDisplayWidth="intervalDisplayWidth"
      />
    </div>

  </div>

</template>

<script>
import { QResizeObservable } from 'quasar'
import mixins from '../../mixins'
import KTimeInterval from './KTimeInterval'
import KTimePointer from './KTimePointer'

export default {
  name: 'k-time-controller',
  components: {
    QResizeObservable,
    KTimeInterval,
    KTimePointer
  },
  mixins: [mixins.rangeCompute],
  props: {
    lineHeight: { type: Number, default: 4 },
    color: { type: String, default: 'black' },
    activeColor: { type: String, default: 'white' },
    pointerColor: { type: String, default: 'orange' },
    pointerTextColor: { type: String, default: 'white' }
  },
  data () {
    return {
      componentLeft: null,
      componentWidth: null
    }
  },
  mounted () {
    this.updateComponentDimensions()
  },
  computed: {
    barStyle () {
      return {
        height: this.barHeight(),
        width: '100%',
        backgroundColor: this.color,
        borderRadius: '2px'
      }
    },
    activeBarStyle () {
      let activeBarWidth = this.activeBarWidth()

      return {
        height: this.barHeight(),
        width: activeBarWidth,
        backgroundColor: this.activeColor,
        borderRadius: activeBarWidth === '100%' ? '2px' : '2px 0 0 2px'
      }
    },
    tickContainerStyle () {
      return {
        height: '18px',   // TODO make configurable
        top: this.barHeight()
      }
    },
    pointerContainerStyle () {
      return {
        height: '18px',   // TODO make configurable
        bottom: 0
      }
    },
    intervalDisplayWidth () {
      return this.componentWidth / this.timeIntervals.length
    }
  },
  methods: {
    barHeight () {
      return this.lineHeight + 'px'
    },
    activeBarWidth () {
      return this.position + 'px'
    },
    updateComponentDimensions () {
      const componentRef = this.$refs.timeControllerBar

      if (componentRef) {
        const componentRect = componentRef.getBoundingClientRect()

        this.componentLeft = componentRect.x
        this.componentWidth = componentRect.width
      }
    },
    onResize (size) {
      this.updateComponentDimensions()
    },
    onChangePosition (newPosition) {
      this.position = newPosition
    }
  }
}
</script>

<style>
  .k-timecontroller-container {
    width: 100%;
    background-color: transparent;
    position: relative;
  }

  .k-timecontroller-activebar, .k-timecontroller-bar {
    position: absolute;
    top: 0;
    cursor: pointer;
  }

  .k-timecontroller-activebar {
    z-index: 100;
  }

  .k-interval-ticks-container, .k-interval-pointer-container {
    position: absolute;
    width: 100%;
    overflow: visible;
  }
</style>