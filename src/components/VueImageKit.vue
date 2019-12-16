<template>
  <div class="vue-image-kit">
    <div v-if="dataUrl" class="vue-image-kit__placeholder" :style="{ backgroundColor }">
      <img :src="placeholder || dataUrl" alt="Placeholder" :style="{ width: `${width}px`, height: `${height}px` }"/>
    </div>
    <img class="vue-image-kit__img" :srcset="getSrcset" :sizes="getSizes" :src="getSrc" :alt="alt" :style="{ width: `${width}px`, height: `${height}px` }"/>
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
      const { srcset, imageKitPrefix, hash, customTransform, src } = this

      return srcset
        .map(size => `${imageKitPrefix}/${hash}/tr:w-${size}${customTransform ? ',' + customTransform : ''}/${src} ${size}w`)
        .join(', ')
    },
    getSizes () {
      const { sizes, srcset, defaultSize } = this
      let sizesString = ''
      if (sizes && sizes.length && (sizes.length === srcset.length)) {
        sizesString = srcset.map((size, idx) => `(max-width: ${size}px) ${sizes[idx]}px`).join(', ')
      }

      sizesString = srcset.map(size => `(max-width: ${size}px) ${parseInt(size, 10) - 40}px`).join(', ')
      sizesString += ` ${defaultSize}px`

      return sizesString
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
      const { $el, timeOut, srcset, getSrcset, imageKitPrefix, hash, src } = this
      const img = $el.querySelector('.vue-image-kit__img')
      const placeholder = $el.querySelector('.vue-image-kit__placeholder')

      img.onload = function () {
        delete img.onload
        $el.classList.add('vue-image-kit--loaded')

        if (placeholder) {
          timeOut = setTimeout(() => {
            placeholder.remove()
          }, 300)
        }
      }

      if (entry.isIntersecting) {
        this.showCanvas = false

        if (srcset) {
          img.srcset = getSrcset
        }

        img.src = `${imageKitPrefix}/${hash}/${src}`
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
