import VueImageKit from '../src/components/VueImageKit.vue'

export default {
  title: 'VueImageKit',
  component: VueImageKit,
  parameters: {
    a11y: {
      element: '#root',
      config: {},
      options: {},
      manual: true,
    },
    controls: { hideNoControlsWarning: true },
    docs: {
      inlineStories: true
    },
    backgrounds: [
      { name: 'Blue', value: 'blue' },
      { name: 'Green', value: 'green' },
      { name: 'Yellow', value: 'yellow' },
      { name: 'Orange', value: 'orange' },
      { name: 'Red', value: 'red' },
      { name: 'Purple', value: 'purple' },
      { name: 'Black', value: 'black' },
      { name: 'White', value: 'white', default: true }
    ]
  },
  argTypes: {
    hash: {
      control: 'text'
    },
    src: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    backgroundColor: {
      control: 'text'
    },
    srcset: {
      control: 'array'
    },
    defaultSize: {
      control: 'number'
    },
    customTransform: {
      control: 'text'
    },
    width: {
      control: 'number'
    },
    height: {
      control: 'number'
    },
    alt: {
      control: 'text'
    },
    lazyLoad: {
      control: 'boolean'
    }
  }
}

export const DefaultComponent = () => ({
  components: { VueImageKit },
  props: {
    hash: {
      type: String,
      default: '6xhf1gnexgdgk'
    },
    src: {
      type: String,
      default: 'lion_BllLvaqVn.jpg'
    },
    placeholder: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: 'Background'
    },
    srcset: {
      type: Array,
      default: [320, 480, 800]
    },
    sizes: {
      type: Array,
      default: []
    },
    defaultSize: {
      type: Number,
      default: 1080
    },
    customTransform: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 1400
    },
    height: {
      type: Number,
      default: 800
    },
    alt: {
      type: String,
      default: ''
    },
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },
  template: `<div>
    <div style="height:2500px;width:100vw;background:gray">&nbsp;</div>
    <vue-image-kit
      :hash="hash"
      :src="src"
      :placeholder="placeholder"
      :background-color="backgroundColor"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      :alt="alt"
      :lazy-load="lazyLoad"
      :default-size="defaultSize"
      :custom-transform="customTransform"
    />
  </div>`
})
