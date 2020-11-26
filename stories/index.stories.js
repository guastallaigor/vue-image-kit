/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { withKnobs, array, text, number, boolean } from '@storybook/addon-knobs'
import VueImageKit from '../src/components/VueImageKit'

const timelineStory = storiesOf('VueImageKit', module)
  .addParameters(
    {
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
    }
  )
  .addDecorator(withKnobs)

timelineStory.add('Default', () => {
  return {
    components: { VueImageKit },
    props: {
      hash: {
        type: String,
        default: text('Hash', '6xhf1gnexgdgk')
      },
      src: {
        type: String,
        default: text('Src', 'lion_BllLvaqVn.jpg')
      },
      placeholder: {
        type: String,
        default: text('Placeholder', '')
      },
      backgroundColor: {
        type: String,
        default: text('Background', '')
      },
      srcset: {
        type: Array,
        default: array('Srcset', [320, 480, 800])
      },
      sizes: {
        type: Array,
        default: array('Sizes', [])
      },
      defaultSize: {
        type: Number,
        default: number('Default size', 1080)
      },
      customTransform: {
        type: String,
        default: text('Custom transform', '')
      },
      width: {
        type: Number,
        default: number('Width', 1400)
      },
      height: {
        type: Number,
        default: number('Height', 800)
      },
      alt: {
        type: String,
        default: text('Alt', '')
      },
      lazyLoad: {
        type: Boolean,
        default: boolean('Lazy Load', true)
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
  }
})
