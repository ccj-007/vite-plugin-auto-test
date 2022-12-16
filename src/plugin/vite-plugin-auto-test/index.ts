//@ts-ignore
import AutoTest from "./AutoTest.vue";

AutoTest.install = (Vue) => {
  Vue.component('AutoTest', AutoTest)
}

export default AutoTest