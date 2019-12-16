<template>
  <div class="vue-image-kit">
    <div v-if="dataUrl" :style="{ backgroundColor }" class="vue-image-kit__placeholder">
      <img :src="placeholder || dataUrl" alt="Placeholder" :style="{ width: `${width}px`, height: `${height}px` }">
    </div>
    <img :srcset="getSrcset" :sizes="getSizes" :src="getSrc" :alt="alt" :style="{ width: `${width}px`, height: `${height}px` }" class="vue-image-kit__img"/>
  </div>
</template>

<script>
export default {
  name: 'VueImageKit',
  props: {
    hash: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    alt: {
      type: String,
      default: ''
    },
    srcset: {
      type: Array,
      default: () => [320, 480, 800]
    },
    sizes: {
      type: Array,
      default: () => []
    },
    defaultSize: {
      type: Number,
      default: 1080
    },
    customTransform: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    imageKitPrefix: 'https://ik.imagekit.io',
    showCanvas: true,
    observer: null,
    timeOut: null
  }),
  computed: {
    dataUrl () {
      const { width, height, showCanvas } = this

      if (!width || !height || !showCanvas) return ''

      const w = 100
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = (height / width) * w

      return canvas.toDataURL()
    },
    getSrc () {
      const { showCanvas, dataUrl, imageKitPrefix, hash, src } = this
      return showCanvas
        ? dataUrl
        : `${imageKitPrefix}/${hash}/${src}`
    },
    getSrcset () {
      return this.srcset
        .map(size => `${this.imageKitPrefix}/${this.hash}/tr:w-${size}${this.customTransform ? ',' + this.customTransform : ''}/${this.src} ${size}w`)
        .join(', ')
    },
    getSizes () {
      let sizes = ''
      if (this.sizes && this.sizes.length && (this.sizes.length === this.srcset.length)) {
        sizes = this.srcset.map((size, idx) => `(max-width: ${size}px) ${this.sizes[idx]}px`).join(', ')
      }

      sizes = this.srcset.map(size => `(max-width: ${size}px) ${parseInt(size, 10) - 40}px`).join(', ')
      sizes += ` ${this.defaultSize}px`

      return sizes
    }
  },
  mounted () {
    this.showCanvas = true

    this.observer = new IntersectionObserver(([entry]) => {
      this.triggerIntersection(entry)
    })
    this.observer.observe(this.$el)

    this.$once('hook:beforeDestroy', () => {
      this.observer.disconnect()

      if (this.timeOut) {
        clearTimeout(this.timeOut)
      }
    })
  },
  methods: {
    triggerIntersection(entry = {}) {
      const img = this.$el.querySelector('.vue-image-kit__img')
      const placeholder = this.$el.querySelector('.vue-image-kit__placeholder')

      img.onload = function () {
        delete img.onload
        this.$el.classList.add('vue-image-kit--loaded')

        if (placeholder) {
          this.timeOut = setTimeout(() => {
            placeholder.remove()
          }, 300)
        }
      }
      if (entry.isIntersecting) {
        this.showCanvas = false

        if (this.srcset) {
          img.srcset = this.getSrcset
        }

        img.src = `${this.imageKitPrefix}/${this.hash}/${this.src}`
        this.observer.disconnect()
      }
    }
  }
}
</script>

<style scoped>
.vue-image-kit {
  display: inline-block;
  position: relative;
}

.vue-image-kit__placeholder {
  position: absolute;
  overflow: hidden;
}

.vue-image-kit__placeholder img {
  transform: scale(1.05);
  filter: blur(10px);
}

.vue-image-kit__img {
  opacity: 0;
  transition: opacity 300ms ease;
}

.vue-image-kit--loaded .vue-image-kit__img {
  opacity: 1;
}
</style>
