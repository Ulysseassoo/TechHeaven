import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createApp } from 'vue'
import './style.css'
import 'vuetify/styles'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import customTheme from './plugins/vuetify'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, fa } from 'vuetify/iconsets/fa'
import 'vue3-toastify/dist/index.css';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme
    }
  }
})

createApp(App).use(vuetify).use(Vue3Toasity,
  {
    autoClose: 3000,
  } as ToastContainerOptions).use(router).mount('#app')
