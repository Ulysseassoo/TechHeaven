import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createApp } from 'vue'
import './style.css'
import 'vuetify/styles'
import App from './App.vue'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  components,
  directives
})

createApp(App).use(vuetify).mount('#app')
