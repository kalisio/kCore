<template>

  <div class="k-timecontroller-container"
       @click="onTimelineClick" @mousemove="onTimelineMouseMove" @mouseout="onTimelineMouseOut">

    <q-resize-observable @resize="onResize" />

    <div v-bind:style="pointerContainerStyle"
         class="k-interval-pointer-container"
    >
      <k-time-pointer
        :position="position"
        :time="currentValue"
        :formatter="timeFormatter"
        :componentLeft="componentLeft"
        :componentWidth="componentWidth"        
        :pointerColor="pointerColor"
        :pointerTextColor="pointerTextColor"
        @change="onChangePosition"
      />

      <k-time-indicator
        :position="timeIndicatorPosition"
        :time="timeIndicatorValue"
        :visible="timeIndicatorIsVisible"
        :formatter="timeFormatter"
        :componentLeft="componentLeft"
        :componentWidth="componentWidth"        
        :color="color"
        :textColor="pointerTextColor"
      />
    </div>

    <div class="k-timecontroller-currenttime" v-bind:style="currentTimeStyle"></div>

    <div class="k-timecontroller-activebar" v-bind:style="activeBarStyle"></div>
    <div class="k-timecontroller-bar" v-bind:style="barStyle" ref="timeControllerBar"></div>

    <div v-bind:style="tickContainerStyle"
         class="k-interval-ticks-container"
    >
      <k-time-interval
        v-for="interval in timeIntervals" :key="interval.value"
        :color="color"
        :interval="interval"
        :formatter="timeFormatter"
        :intervalDisplayWidth="intervalDisplayWidth"
        :labelFontSize="labelFontSize"
      />
    </div>

  </div>

</template>

<script>
import { QResizeObservable } from 'quasar'
import mixins from '../../mixins'
import KTimeInterval from './KTimeInterval'
import KTimePointer from './KTimePointer'
import KTimeIndicator from './KTimeIndicator'

export default {
  name: 'k-time-controller',
  components: {
    QResizeObservable,
    KTimeInterval,
    KTimePointer,
    KTimeIndicator
  },
  mixins: [mixins.rangeCompute],
  props: {
    lineHeight: { type: Number, default: 4 },
    color: { type: String, default: 'black' },
    activeColor: { type: String, default: 'white' },
    pointerColor: { type: String, default: 'orange' },
    pointerTextColor: { type: String, default: 'white' },
    labelFontSize: { type: Number, default: 16 }
  },
  data () {
    return {
      componentLeft: null,
      componentWidth: null,
      timeIndicatorPosition: null,
      timeIndicatorValue: null,
      timeIndicatorIsVisible: false,
      timeNow: null,
      timeUpdater: null
    }
  },
  mounted () {
    this.updateComponentDimensions()

    // update current time immediately, and then every 30 seconds
    this.updateTime()
    this.timeUpdater = setInterval(this.updateTime, 30000)
  },
  beforeDestroy () {
    clearInterval(this.timeUpdater)
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
    currentTimeStyle () {
      const timeNowPosition = this.calculatePosition(this.timeNow, this.min, this.max, this.componentWidth)

      return {
        marginLeft: timeNowPosition + 'px',
        height: this.barHeight(),
        width: '6px',
        backgroundColor: this.pointerColor
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
      return this.componentWidth * this.timeInterval.length / (this.max - this.min)
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
    onChangePosition (event) {
      this.changePosition(event.value, event.final)
    },
    onTimelineClick (event) {
      let newPosition = event.clientX - this.componentLeft

      // Don't allow a position out of bounds
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > this.componentWidth) {
        newPosition = this.componentWidth
      }

      this.onChangePosition({value: newPosition, final: true})
    },
    onTimelineMouseOut (event) {
      this.timeIndicatorIsVisible = false
    },
    onTimelineMouseMove (event) {
      let newPosition = event.clientX - this.componentLeft

      this.timeIndicatorIsVisible = true
      this.timeIndicatorPosition = newPosition
      this.timeIndicatorValue = this.calculateValue(newPosition, this.min, this.max, this.componentWidth)
    },
    updateTime () {
      this.timeNow = Date.now()
    }
  }
}
</script>

<style>
  .k-timecontroller-container {
    width: 100%;
    padding-top: 0;
    padding-bottom: 12px;
    background-color: transparent;
    position: relative;
    cursor: pointer;
  }

  .k-timecontroller-activebar, .k-timecontroller-bar, .k-timecontroller-currenttime {
    position: absolute;
    top: 0;
  }

  .k-timecontroller-activebar {
    z-index: 100;
  }

  .k-timecontroller-currenttime {
    z-index: 200;
  }

  .k-interval-ticks-container, .k-interval-pointer-container {
    position: absolute;
    width: 100%;
    overflow: visible;
  }
</style>