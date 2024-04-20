import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createApp } from 'vue'
import './style.css'
import 'vuetify/styles'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import customTheme from './plugins/vuetify'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme
    }
  }
})

createApp(App).use(vuetify).mount('#app')
