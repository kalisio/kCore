let rangeComputeMixin = {
  props: {
    min: null,
    max: null,
    value: null
  },
  data () {
    return {
      currentValue: this.value,
      timeInterval: this.calculateTimeInterval(this.min, this.max)
    }
  },
  computed: {
    position: {
      get: function () {
        return this.calculatePosition(this.currentValue, this.min, this.max, this.componentWidth)
      },
      set: function (newPosition) {
        this.currentValue = this.calculateValue(newPosition, this.min, this.max, this.componentWidth)

        this.$emit('change', this.currentValue)
      }
    },
    timeIntervals () {
      let intervalValues = this.calculateIntervals(this.min, this.max, this.timeInterval.length)
      let timeIntervals = []

      for (let i = 0, len = intervalValues.length - 1; i < len; i++) {
        const value = intervalValues[i]
        const nextValue = intervalValues[i + 1]

        timeIntervals.push(
            this.getTimeInterval(value, nextValue, this.timeInterval.type,
              this.min, this.max, this.componentWidth,
              i = 0, i = len - 1
            )
        )
      }

      return timeIntervals
    }
  },
  methods: {
    calculatePosition (value, rangeStart, rangeEnd, componentWidth) {
      return Math.round(componentWidth * (value - rangeStart) / (rangeEnd - rangeStart))
    },
    calculateValue (position, rangeStart, rangeEnd, componentWidth) {
      return Math.round(rangeStart + position / componentWidth * (rangeEnd - rangeStart))
    },
    calculateTimeInterval (rangeStart, rangeEnd) {
      // Determine if the time range is to be divided into minute, hour, day or week intervals

      // length of the time range in minutes, hours and days
      const minutes = (rangeEnd - rangeStart) / 60000
      const hours = minutes / 60
      const days = hours / 24

      if (days > 30) {
        // choose week intervals
        return {type: 'w', length: 7 * 24 * 60 * 60000}
      }

      if (hours > 48) {
        // choose day intervals
        return {type: 'd', length: 24 * 60 * 60000}
      }

      if (minutes > 120) {
        // choose hour intervals
        return {type: 'h', length: 60 * 60000}
      }

      // choose minute intervals
      return {type: 'm', length: 60000}
    },
    calculateIntervals (rangeStart, rangeEnd, intervalLength) {
      let startValue = rangeStart

      let multiple = startValue / intervalLength
      let intvalue = Math.trunc(multiple)

      if (multiple > intvalue) {
        startValue = (intvalue + 1) * intervalLength
      }

      let intervals = []
      let value = startValue

      while (value <= rangeEnd) {
        intervals.push(value)
        value += intervalLength
      }

      return intervals
    },
    getTimeInterval (value, nextValue, type, rangeStart, rangeEnd, componentWidth, isFirstValue, isLastValue) {
      return {
        value,
        nextValue,
        type,
        position: this.calculatePosition(value, rangeStart, rangeEnd, componentWidth),
        nextPosition: this.calculatePosition(nextValue, rangeStart, rangeEnd, componentWidth),
        isFirstValue,
        isLastValue,
        displayFirstTick: value > rangeStart,
        displayNextTick: isLastValue && nextValue < rangeEnd
      }
    }
  }
}

export default rangeComputeMixin
