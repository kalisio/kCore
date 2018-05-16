<template>
  <span v-html="markdownAsHtml" />
</template>

<script>
import showdown from 'showdown'

export default {
  name: 'k-markdown-viewer',
  props: {
    url: {
      type: String,
      default: ''
    },
    markdown: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    url: function () {
      this.markdown = ''
      this.processMarkdown()
    },
    markdown: function () {
      this.processMarkdown()
    },
    options: function () {
      this.processMarkdown()
    }
  },
  data () {
    return {
      markdownAsHtml: ''
    }
  },
  methods: {
    async processMarkdown() {
      let converter = new showdown.Converter(this.options)
      converter.setFlavor('github')
      if (!this.markdown && this.url) {
        let response = await fetch(this.url)
        if (response.status !== 200) {
          throw new Error('Impossible to retrieve markdown: ' + response.status)
        }
        this.markdown = await response.text()
      }
      this.markdownAsHtml = converter.makeHtml(this.markdown)
    }
  },
  mounted () {
    this.processMarkdown()
  }
}
</script>
