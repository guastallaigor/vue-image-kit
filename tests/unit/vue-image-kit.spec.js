import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import VueImageKit from '../../src/components/VueImageKit'
import 'jest-canvas-mock'

function setupIntersectionObserverMock ({
  observe = () => null,
  unobserve = () => null
} = {}) {
  class IntersectionObserver {
    observe = observe
    unobserve = unobserve
    disconnect () {}
  }
  Object.defineProperty(
    window,
    'IntersectionObserver',
    { writable: true, configurable: true, value: IntersectionObserver }
  )
  Object.defineProperty(
    global,
    'IntersectionObserver',
    { writable: true, configurable: true, value: IntersectionObserver }
  )
}

describe('When I create the VueImageKit component', () => {
  const item = { hash: '6xhf1gnexgdgk', src: 'lion_BllLvaqVn.jpg' }

  beforeEach(() => {
    setupIntersectionObserverMock()
  })

  const createComponent = (propsData = {}) => {
    return shallowMount(VueImageKit, { propsData })
  }

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
    const lazyLoad = wrapper.vm.$options.props.lazyLoad
    expect(lazyLoad.required).toBeFalsy()
    expect(lazyLoad.type).toBe(Boolean)
    expect(lazyLoad.default).toBe(true)
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

  it('should have different srcset from default', async () => {
    const wrapper = createComponent({ ...item, srcset: [400, 600, 900] })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    wrapper.vm.triggerIntersection({ isIntersecting: true })
    await wrapper.vm.$nextTick()
    const expected = 'https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-400/lion_BllLvaqVn.jpg 400w, https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-600/lion_BllLvaqVn.jpg 600w, https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-900/lion_BllLvaqVn.jpg 900w'
    expect(main.attributes().srcset).toBe(expected)
  })

  it('should have different sizes from default', async () => {
    const wrapper = createComponent({ ...item, srcset: [200, 250, 300] })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    wrapper.vm.triggerIntersection({ isIntersecting: true })
    await wrapper.vm.$nextTick()
    const expected = '(max-width: 200px) 160px, (max-width: 250px) 210px, (max-width: 300px) 260px 1080px'
    expect(main.attributes().sizes).toBe(expected)
  })

  it('should have different sizes and srcset from default', async () => {
    const wrapper = createComponent({ ...item, srcset: [210, 220, 230], sizes: [210, 220, 230] })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    wrapper.vm.triggerIntersection({ isIntersecting: true })
    await wrapper.vm.$nextTick()
    const expected = '(max-width: 210px) 210px, (max-width: 220px) 220px, (max-width: 230px) 230px 1080px'
    expect(main.attributes().sizes).toBe(expected)
    const expectedSrcset = 'https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-210/lion_BllLvaqVn.jpg 210w, https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-220/lion_BllLvaqVn.jpg 220w, https://ik.imagekit.io/6xhf1gnexgdgk/tr:w-230/lion_BllLvaqVn.jpg 230w'
    expect(main.attributes().srcset).toBe(expectedSrcset)
  })

  it('should have different default size', () => {
    const wrapper = createComponent({ ...item, defaultSize: 1366 })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    expect(main.attributes().sizes).toContain('1366px')
  })

  it('should not have lazy load', () => {
    const wrapper = createComponent({ ...item, lazyLoad: false })
    const main = wrapper.find('.vue-image-kit')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('vue-image-kit--loaded')
    const placeholder = wrapper.find('.vue-image-kit__placeholder')
    expect(placeholder.exists()).toBe(false)
    expect(wrapper.vm.showCanvas).toBe(false)
    expect(wrapper.vm.$refs.normalLoad).toBeInstanceOf(HTMLImageElement)
  })

  it('should have a custom transform', async () => {
    // https://imagekit.io/features/advanced-image-manipulation-blur-rotate-crop-background-radius
    const customTransform = 'c-at_max,bl-1:r-20,bg-FFCFA1'
    const wrapper = createComponent({ ...item, customTransform })
    const main = wrapper.find('.vue-image-kit > .vue-image-kit__img')
    expect(main.exists()).toBe(true)
    wrapper.vm.triggerIntersection({ isIntersecting: true })
    await wrapper.vm.$nextTick()
    expect(main.attributes().srcset).toContain(customTransform)
  })

  it('should disconnect the observer on destroy', () => {
    const wrapper = createComponent({ ...item })
    expect(wrapper.vm.observer).toStrictEqual(new IntersectionObserver({ observe: () => jest.fn(), unobserve: () => jest.fn() }))
    wrapper.destroy()
    expect(wrapper.vm.observer).toStrictEqual(new IntersectionObserver({ observe: () => jest.fn(), unobserve: () => jest.fn() }))
    const disconnect = jest.fn()
    expect(JSON.stringify(wrapper.vm.observer.disconnect)).toBe(JSON.stringify(disconnect))
    expect(wrapper.exists()).toBeFalsy()
  })

  it('should clear the timeout on disconnect', (done) => {
    const wrapper = createComponent({ ...item, width: 300, height: 300, placeholder: 'https://ik.imagekit.io/6xhf1gnexgdgk/igor2_HJhiHMa54.png' })
    expect(wrapper.exists()).toBe(true)
    wrapper.destroy()
    setTimeout(() => {
      expect(wrapper.vm.timeOut).toBe(null)
      done()
    }, 500)
  })

  it('should trigger intersection', async () => {
    const localVue = createLocalVue()
    const wrapper = mount(VueImageKit, {
      propsData: { ...item, width: 300, height: 300, placeholder: 'https://ik.imagekit.io/6xhf1gnexgdgk/igor2_HJhiHMa54.png' },
      localVue,
      stubs: {
        transition: false
      }
    })
    wrapper.vm.observer.disconnect = jest.fn()
    expect(wrapper.exists()).toBe(true)
    wrapper.vm.triggerIntersection({ isIntersecting: true })
    expect(wrapper.vm.timeOut).toBeNull()
    expect(wrapper.vm.showCanvas).toBeFalsy()
    const img = wrapper.find('.vue-image-kit__img')
    expect(img.exists()).toBe(true)
    const placeholder = wrapper.find('.vue-image-kit__placeholder')
    expect(placeholder.exists()).toBe(true)
    expect(wrapper.vm.$el.querySelector('.vue-image-kit__placeholder')).toBeDefined()
    wrapper.vm.$el.querySelector('.vue-image-kit__img').onload()
    await wrapper.vm.$nextTick()
    const placeholderAgain = wrapper.find('.vue-image-kit__placeholder')
    expect(placeholderAgain.exists()).toBe(false)
    expect(wrapper.vm.timeOut).not.toBeNull()
    expect(wrapper.vm.$el.querySelector('.vue-image-kit__placeholder')).toBeNull()
  })

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
