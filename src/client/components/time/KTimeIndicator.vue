<template>
  <div>
    <div class="k-time-pointer"
         v-bind:style="pointerStyle"
    >
      {{pointerLabel}}
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'k-time-indicator',
  components: {
  },
  props: {
    position: null,
    time: null,
    visible: null,
    componentLeft: null,
    componentWidth: null,
    timeInterval: null,
    color: null,
    textColor: null
  },
  data () {
    return {
    }
  },
  computed: {
    pointerStyle () {
      return {
        // Put the "tip" of the pointer's downward pointing arrow at the right place. We need an offset
        // of 25px, this is the distance of the downward "arrow" from the left side of the label box.
        left: this.position - 25 + 'px',
        color: this.textColor,
        visibility: this.visible ? 'visible' : 'hidden',
        backgroundColor: this.color,
        // Set a CSS var that gets used in the ::after pseudo-element,
        // see: https://forum.vuejs.org/t/style-binding-on-pseudo-selector/5544/7
        '--pointerColor': this.color
      }
    },
    pointerLabel () {
      // Formats the label value for the time interval, taking into account the interval type (hour, day, week etc)

      const value = new Date(this.time)
      const type = this.timeInterval.type

      let label = moment(value).format('h:mm A')

      return label
    }
  },
  methods: {
  }
}
</script>

<style>
  .k-time-pointer {
    position: absolute;
    bottom: 19px;
    border-radius: 7px;
    font-size: 12px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-left: 8px;
    padding-right: 8px;
    cursor: grab;
    height: 26px;
    white-space: nowrap;
    user-select: none;
    z-index: 200;
  }

  .k-time-pointer::after {
    position: absolute;
    top: 100%;
    left: 25px;
    height: 0;
    width: 0;
    margin-left: -0.5em;
    content: ' ';
    border: solid transparent;
    border-top-color: var(--pointerColor);
    border-top-style: solid;
    border-top-width: 0.5em;
    border-right-color: transparent;
    border-right-style: solid;
    border-right-width: 0.5em;
    border-bottom-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 0.5em;
    border-left-color: transparent;
    border-left-style: solid;
    border-left-width: 0.5em;
    border-image-source: initial;
    border-image-slice: initial;
    border-image-width: initial;
    border-image-outset: initial;
    border-image-repeat: initial;
    border-width: .5em;
    border-top-width: 0.5em;
    border-right-width: 0.5em;
    border-bottom-width: 0.5em;
    border-left-width: 0.5em;    
    border-top-width: 0.5em;
    border-right-width: 0.5em;
    border-bottom-width: 0.5em;
    border-left-width: 0.5em;
  }
</style>