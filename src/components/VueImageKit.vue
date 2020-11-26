<template>
  <div
    :class="{ 'vue-image-kit--loaded': !lazyLoad }"
    class="vue-image-kit"
    ref="main"
  >
    <template v-if="lazyLoad">
      <div
        v-if="getDataUrl"
        :key="getRandomId"
        :style="{ backgroundColor }"
        class="vue-image-kit__placeholder"
      >
        <img
          :src="placeholder || getDataUrl"
          :style="{ width: `${width}px`, height: `${height}px` }"
          alt="Placeholder"
          ref="placeholder"
        />
      </div>
      <img
        :sizes="getSizes"
        :style="{ width: `${width}px`, height: `${height}px` }"
        :alt="alt"
        class="vue-image-kit__img"
        ref="lazyLoad"
      />
    </template>
    <img
      v-else
      :sizes="getSizes"
      :style="{ width: `${width}px`, height: `${height}px` }"
      :alt="alt"
      ref="normalLoad"
      class="vue-image-kit__img"
    />
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
    },
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    imageKitPrefix: 'https://ik.imagekit.io',
    showCanvas: true,
    observer: null,
    timeOut: null
  }),
  computed: {
    getRandomId () {
      return Math.random().toString(36).substr(2, 9)
    },
    getDataUrl () {
      const { width, height, showCanvas } = this

      if (!width || !height || !showCanvas) return ''

      const w = 100
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = (height / width) * w

      return canvas.toDataURL()
    },
    getSrcset () {
      const { srcset, imageKitPrefix, hash, customTransform, src } = this

      return srcset
        ? srcset
          .map(size => `${imageKitPrefix}/${hash}/tr:w-${size}${customTransform
          ? ',' + customTransform
          : ''}/${src} ${size}w`)
          .join(', ')
        : []
    },
    getSizes () {
      const { sizes, srcset, defaultSize } = this
      let sizesString = ''

      if (sizes && sizes.length && (sizes.length === srcset.length)) {
        sizesString = srcset.map((size, idx) => `(max-width: ${size}px) ${sizes[idx]}px`).join(', ')
      } else {
        sizesString = srcset.map(size => `(max-width: ${size}px) ${parseInt(size, 10) - 40}px`).join(', ')
      }

      sizesString += ` ${defaultSize}px`

      return sizesString
    }
  },
  mounted () {
    if (this.lazyLoad) {
      this.initLazyLoad()
      return
    }

    this.initNormalLoad()
  },
  methods: {
    initNormalLoad () {
      const img = this.$refs.normalLoad
      this.setImgAttributes(img)
    },
    initLazyLoad () {
      this.showCanvas = true
      this.observer = new IntersectionObserver(([entry]) => {
        this.triggerIntersection(entry)
      })
      this.observer.observe(this.$refs.main)
      this.$once('hook:beforeDestroy', () => {
        this.observer.disconnect()

        if (this.timeOut) {
          clearTimeout(this.timeOut)
        }
      })
    },
    onloadImage (imgEl) {
      delete imgEl.onload
      const { main, placeholder } = this.$refs

      if (main) {
        main.classList.add('vue-image-kit--loaded')
      }

      if (placeholder) {
        this.timeOut = setTimeout(() => {
          placeholder.remove()
        }, 300)
      }
    },
    setImgAttributes (img) {
      const { srcset, getSrcset, imageKitPrefix, hash, src } = this
      this.showCanvas = false

      if (srcset) {
        img.srcset = getSrcset
      }

      img.src = `${imageKitPrefix}/${hash}/${src}`
    },
    triggerIntersection (entry = {}) {
      const img = this.$refs.lazyLoad

      img.onload = function () {
        this.onloadImage(img)
      }.bind(this)

      if (entry.isIntersecting) {
        this.setImgAttributes(img)
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
