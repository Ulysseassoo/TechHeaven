import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createApp } from "vue";
import "@/style.css";
import "vuetify/styles";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import customTheme from "@/plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { aliases, fa } from "vuetify/iconsets/fa";
import "vue3-toastify/dist/index.css";
import Vue3Toasity, { type ToastContainerOptions } from "vue3-toastify";
import { createPinia } from "pinia";
import router from "@/router";
import { getUserInformation } from "./api/auth";
import { useUserStore } from "./store/UserStore";
const pinia = createPinia();

const vuetify = createVuetify({
  icons: {
    defaultSet: "fa",
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
      customTheme,
    },
  },
});

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(vuetify);
app.use(Vue3Toasity, {
  autoClose: 3000,
} as ToastContainerOptions);

const store = useUserStore();

// Forced to load the navigation guard here to use the store before navigating
router.beforeEach(async (to, from, next) => {
  try {
    const token = localStorage.getItem("token");
    if (to.meta.requiresAuth) {
      if (!token) {
        next({ name: "Login" });
      } else {
        const response = await getUserInformation();
        store.setUser(response.data);
        if (to.meta.role) {
          if (response.data.role === to.meta.role) {
            next();
          } else {
            next({ name: "Home" });
          }
        }
        return next();
      }
    } else {
      next();
    }
  } catch (error: any) {
    next({ name: "Login" });
    store.setUser(null);
  }
});

app.use(router);
app.mount("#app");
