import { createRouter, createWebHistory } from "vue-router"
import HomeView from './pages/HomeView.vue'
import LoginView from './pages/LoginView.vue'

const routes = [
    { path: '/', name: "home", component: HomeView },
    { path: '/login', name: "login", component: LoginView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router