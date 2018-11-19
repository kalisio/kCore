let rangeComputeMixin = {
  props: [
    'min',    // min value: time from
    'max',    // max value: time until
    'step',   // step (granularity): 'h' (hour) or 'm' (minute)
    'value'   // value: initial time
  ],
  data () {
    return {
      currentValue: this.value,
      previousValue: null,
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

        if (this.valueChanged(this.currentValue, this.previousValue, this.step)) {
          this.previousValue = this.currentValue

          this.$emit('change', this.currentValue)
        }
      }
    },
    timeIntervals () {
      let intervalValues = this.calculateIntervals(this.min, this.max, this.timeInterval)
      let timeIntervals = []

      // Push the time intervals; note that the number of intervals is one less than the number of values
      for (let i = 0, len = intervalValues.length - 1; i < len; i++) {
        const value = intervalValues[i]
        const nextValue = intervalValues[i + 1]

        timeIntervals.push(
            this.getTimeInterval(value, nextValue, this.timeInterval.type,
              this.min, this.max, this.componentWidth,
              i === 0, i === len - 1
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
    calculateTimeInterval(rangeStart, rangeEnd) {
      // Determine if the time range is to be divided into hour or day intervals

      // length of the time range in minutes, hours and days
      const minutes = (rangeEnd - rangeStart) / 60000
      const hours = minutes / 60

      if (hours >= 24) {
        // choose day intervals
        return { type: 'd', length: 24 * 60 * 60000 }
      }

      // choose hour intervals
      return { type: 'h', length: 60 * 60000 }
    },
    calculateIntervals(rangeStart, rangeEnd, timeInterval) {
      const intervalLength = timeInterval.length
      const intervalType = timeInterval.type

      let intervals = []
      let value = this.getIntervalStartValue(rangeStart, timeInterval.type)

      while (value <= rangeEnd+timeInterval.length) {
        intervals.push(value)
        value += timeInterval.length
      }

      return intervals
    },
    getIntervalStartValue (rangeStart, intervalType) {
      const startTime = new Date(rangeStart)

      const year = startTime.getFullYear()
      const month = startTime.getMonth()
      const day = startTime.getDate()
      const hour = startTime.getHours()
      const minute = startTime.getMinutes()

      let startValue

      switch (intervalType) {
        case 'd':
          // range starts on a day (ignoring seconds)
          if (hour == 0 && minute == 0) {
            startValue = rangeStart

          } else {
            let startOfDay = new Date(year, month, day, 0, 0, 0)
            startOfDay.setDate(startOfDay.getDate() + 1)

            startValue = startOfDay.getTime()
          } 
          break
        case 'h':
          // range starts on an hour (ignoring seconds)
          if (minute == 0) {
            startValue = rangeStart

          } else {
            let startOfHour = new Date(year, month, day, 0, 0, 0)
            startOfHour.setHours(startOfHour.getHours() + 1)

            startValue = startOfHour.getTime()
          } 
          break
        default:
          startValue = rangeStart
          break
      }

      return startValue
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
    },
    valueChanged (value, previousValue, step) {
      let changed = true

      if (step !== null) {
        changed = false

        if (previousValue === null) {
          changed = true

        } else {
          const difference = Math.abs(value - previousValue)

          switch (step) {
            case 'h':
              changed = (difference >= 60 * 60000)
              break
            case 'm':
              changed = (difference >= 60000)   
              break
            default:
              changed = true
          }
        }
      }

      return changed
    }
  }
}

export default rangeComputeMixin
