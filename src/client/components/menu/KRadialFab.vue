<!-- Adapted from https://github.com/vparadis/vue-radial-menu -->
<template>
  <div>
    <div v-if="button" :style="style" class="vue-radial-menu-wrapper">
      <div
          :class="['vue-radial-menu-container', isOpen && 'open']"
          :style="style"
          @click="toggle">+</div>
      <slot v-if="isOpen"></slot>
    </div>
    <div v-if="!button" >
      <slot v-if="isOpen"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-radial-fab',
  props: {
    angleRestriction: { type: Number, default: 180 },
    size: { type: Number, default: 50 },
    itemSize: { type: Number, default: 36 },
    rotate: { type: Number, default: 0 },
    radius: { type: Number, default: 100 },
    button: true
  },
  data() {
    const { size } = this
    return {
      isOpen: false,
      style: {
        width: size + 'px',
        height: size + 'px'
      }
    }
  },
  mounted() {
    this.setChildProps()
  },
  beforeUpdate() {
    this.setChildProps()
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeMenuEvent)
  },
  methods: {
    closeMenuEvent(e) {
      if (!this.$el.contains(e.target)) this.close()
    },
    open() {
      if (!this.isOpen) {
        this.isOpen = true
        setTimeout(() => document.addEventListener('click', this.closeMenuEvent), 100)
        this.$emit('open')
      }
    },
    close() {
      if (this.isOpen) {
        this.isOpen = false
        document.removeEventListener('click', this.closeMenuEvent)
        this.$emit('close')
      }
    },
    toggle() {
      if (this.isOpen) this.close()
      else this.open()
    },
    setChildProps() {
      // Manually add prop data to the items
      const items = this.$slots.default.map(s => s.componentOptions.propsData)
      const { size, itemSize, angleRestriction, rotate, radius } = this
      const angle =
        angleRestriction > 300 || angleRestriction < -300 ? 300 : angleRestriction
      const frags = angle / (items.length - 1 || 1)
      const angles = items.map(
        (item, index) => (Math.PI * (frags * index + rotate)) / 180
      )

      items.forEach((propData, index) => {
        propData.width = itemSize
        propData.height = itemSize
        propData.left =
          -1 * (size / 2 + Math.cos(angles[index]) * radius - itemSize / 2) // -1 to have the items in the right order
        propData.top = size / 2 - Math.sin(angles[index]) * radius - itemSize / 2
        propData.onClick = this.close // To prevent double emiting click event
      })
    }
  }
}
</script>

<style>
.vue-radial-menu-wrapper {
  position: relative;
  user-select: none;
  border-radius: 50%;
  font-size: 32px;
  font-weight: bold;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24), 0 0 0 rgba(0, 0, 0, 0.16);
}

.vue-radial-menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;
  z-index: 6;
}

.vue-radial-menu-container.open {
  transform: rotateZ(45deg);
}
</style>