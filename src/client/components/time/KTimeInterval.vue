<template>
  <div>
    <div v-if="timeInterval.displayFirstTick" class="k-interval-tick" v-bind:style="firstTickStyle">
    </div>
    <div class="k-interval-label" v-bind:style="labelStyle">
      {{intervalLabel}}
    </div>
    <div v-if="timeInterval.displayNextTick" class="k-interval-tick" v-bind:style="nextTickStyle">
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'k-time-interval',
  components: {
  },
  props: {
    timeInterval: null,
    intervalDisplayWidth: null,
    color: null,
    labelFontSize: null
  },
  data () {
    return {
    }
  },
  computed: {
    firstTickStyle () {
      return {
        left: this.timeInterval.position + 'px',
        backgroundColor: this.color
      }
    },
    nextTickStyle () {
      return {
        left: this.timeInterval.nextPosition + 'px',
        backgroundColor: this.color
      }
    },
    labelStyle () {
      return {
        left: this.timeInterval.position + 'px',
        width: this.intervalDisplayWidth + 'px',
        color: this.color,
        fontSize: this.labelFontSize + 'px'
      }
    },
    intervalLabel () {
      // Formats the label value for the time interval, taking into account the interval type (hour, day, week etc)
      // and the available display space (intervalDisplayWidth)

      const value = new Date(this.timeInterval.value)
      const type = this.timeInterval.type
      const width = this.intervalDisplayWidth

      let label

      if (type === 'h' || type === 'm') {
        label = moment(value).format('hh:mm')
      } else if (type === 'd') {
        if (width >= 80) {
          label = moment(value).format('dddd D')
        } else {
          label = moment(value).format('ddd')
        }
      } else {
        label = ''
      }

      return label
    }
  },
  methods: {
  }
}
</script>

<style>
  .k-interval-tick {
    position: absolute;
    width: 1px;
    height: 100%;
    opacity: 0.5;
  }

  .k-interval-label {
    position: absolute;
    top: 3px;
    height: 100%;
    text-align: center;
    opacity: 0.5;
  }
</style>