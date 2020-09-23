import Vue from 'vue'
import App from './App.vue'
import router from './router'

import TreeTable from 'vue-table-with-tree-grid'


import './plugins/element'

import './assets/css/global.css'

import './assets/fonts/iconfont.css'

Vue.component("tree-table", TreeTable)

// 引入富文本编辑器

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

Vue.config.productionTip = false


Vue.filter("dateFormat", function (origin) {

  const now = new Date(origin)

  const year = now.getFullYear()

  const month = (now.getMonth() + 1 + '').padStart(2, '0')


  const dt = (now.getDate() + '').padStart(2, '0')
  const hours = (now.getHours() + '').padStart(2, '0')

  const mini = (now.getMinutes() + '').padStart(2, '0')

  const seconds = (now.getSeconds() + '').padStart(2, '0')


  return `${year}-${month}-${dt} ${hours}:${mini}:${seconds}`

})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
