import { mount } from '@vue/test-utils'
import VueImageKit from '../../src/components/VueImageKit'
import 'jest-canvas-mock'

function setupIntersectionObserverMock({
  observe = () => null,
  unobserve = () => null,
} = {}) {
  class IntersectionObserver {
    observe = observe;
    unobserve = unobserve;
  }
  Object.defineProperty(
    window,
    'IntersectionObserver',
    { writable: true, configurable: true, value: IntersectionObserver }
  );
  Object.defineProperty(
    global,
    'IntersectionObserver',
    { writable: true, configurable: true, value: IntersectionObserver }
  );
}

describe('When I create the VueImageKit component', () => {
  const item = { hash: '6xhf1gnexgdgk', src: 'lion_BllLvaqVn.jpg' }

  beforeEach(() => {
    setupIntersectionObserverMock();
  })
  const createComponent = (propsData = {}, slot) => {
    return mount(VueImageKit, {
      propsData
    })
  }

  it('should be a Vue instance', () => {
    const wrapper = createComponent(item)
    expect(wrapper.find(VueImageKit).isVueInstance()).toBe(true)
  })

  it('should validate all props', () => {
    const consoleLog = console.error
    console.error = jest.fn()
    const wrapper = createComponent(item)
    const hash = wrapper.vm.$options.props.hash
    expect(hash.required).toBeTruthy()
    expect(hash.type).toBe(String)
    expect(hash.default).toBe(undefined)
    const src = wrapper.vm.$options.props.src
    expect(src.required).toBeTruthy()
    expect(src.type).toBe(String)
    expect(src.default).toBe(undefined)
    const placeholder = wrapper.vm.$options.props.placeholder
    expect(placeholder.required).toBeFalsy()
    expect(placeholder.type).toBe(String)
    expect(placeholder.default).toBe('')
    const backgroundColor = wrapper.vm.$options.props.backgroundColor
    expect(backgroundColor.required).toBeFalsy()
    expect(backgroundColor.type).toBe(String)
    expect(backgroundColor.default).toBe('')
    const srcset = wrapper.vm.$options.props.srcset
    expect(srcset.required).toBeFalsy()
    expect(srcset.type).toBe(Array)
    const defaultSrcset = { default: () => [320, 480, 800] }
    expect(JSON.stringify(srcset.default)).toEqual(JSON.stringify(defaultSrcset.default))
    const sizes = wrapper.vm.$options.props.sizes
    expect(sizes.required).toBeFalsy()
    expect(sizes.type).toBe(Array)
    console.log(JSON.stringify(sizes.default))
    expect(JSON.stringify(sizes.default)).toBeFalsy()
    const defaultSize = wrapper.vm.$options.props.defaultSize
    expect(defaultSize.required).toBeFalsy()
    expect(defaultSize.type).toBe(Number)
    expect(defaultSize.default).toBe(1080)
    const customTransform = wrapper.vm.$options.props.customTransform
    expect(customTransform.required).toBeFalsy()
    expect(customTransform.type).toBe(String)
    expect(customTransform.default).toBe('')
    const width = wrapper.vm.$options.props.width
    expect(width.required).toBeFalsy()
    expect(width.type).toBe(Number)
    expect(width.default).toBe(null)
    const height = wrapper.vm.$options.props.height
    expect(height.required).toBeFalsy()
    expect(height.type).toBe(Number)
    expect(height.default).toBe(null)
    const alt = wrapper.vm.$options.props.alt
    expect(alt.required).toBeFalsy()
    expect(alt.type).toBe(String)
    expect(alt.default).toBe('')
    const component = wrapper.find('.vue-image-kit')
    expect(component.exists()).toBe(true)
    console.error = consoleLog
  })

  it('should have a width, height and a placeholder', () => {
    const wrapper = createComponent({ ...item, width: 300, height: 300, placeholder: 'https://ik.imagekit.io/6xhf1gnexgdgk/igor2_HJhiHMa54.png' })
    const found = wrapper.find('.vue-image-kit > .vue-image-kit__placeholder > img')
    expect(found.exists()).toBe(true)
    const expected = {
      src: 'https://ik.imagekit.io/6xhf1gnexgdgk/igor2_HJhiHMa54.png',
      alt: 'Placeholder',
      style: 'width: 300px; height: 300px;'
    }
    expect(JSON.stringify(found.attributes())).toBe(JSON.stringify(expected))
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    expect(main.attributes().style).toBe('width: 300px; height: 300px;')
  })

  it('should have a alt attribute', () => {
    const wrapper = createComponent({ ...item, alt: 'Lion image' })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    expect(main.attributes().alt).toBe('Lion image')
  })

  it('should have background color in the placeholder', () => {
    const wrapper = createComponent({ ...item, width: 300, height: 300, placeholder: 'https://ik.imagekit.io/6xhf1gnexgdgk/igor2_HJhiHMa54.png', backgroundColor: '#f40' })
    const placeholder = wrapper.find('.vue-image-kit > .vue-image-kit__placeholder')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.attributes().style).toBe('background-color: rgb(255, 68, 0);') // #f40
  })

  // ! Missing tests for props
  // srcset: {
  //   type: Array,
  //   default: () => [320, 480, 800]
  // },
  // sizes: {
  //   type: Array,
  //   default: () => []
  // },
  // defaultSize: {
  //   type: Number,
  //   default: 1080
  // },
  // customTransform: {
  //   type: String,
  //   default: ''
  // }

  it('should match snapshot', () => {
    const wrapper = createComponent({
      ...item,
      placeholder: '',
      backgroundColor: '',
      width: null,
      height: null,
      alt: '',
      srcset: [320, 480, 800],
      sizes: [],
      defaultSize: 1080,
      customTransform: ''
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
