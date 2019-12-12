import VueImageKit from './src/components/VueImageKit.vue'

// Export components
const Components = {
  VueImageKit
}

const VueImageKitPlugin = {
  install (Vue) {
    Object.keys(Components).forEach((name) => {
      Vue.component(name, Components[name])
    })
  }
}

// Export as a plugin
export default VueImageKitPlugin

// Export as individual components
export {
  VueImageKit
}
