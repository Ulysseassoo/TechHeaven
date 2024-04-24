import { RouteRecordName, createRouter, createWebHistory } from "vue-router"
import HomeView from './pages/HomeView.vue'
import LoginView from './pages/LoginView.vue'
import NotFoundView from './pages/NotFoundView.vue'

const routes = [
    { path: '/', name: "Home", component: HomeView },
    { path: '/login', name: "Login", component: LoginView },
    { path: '/:pathMatch(.*)', name: "NotFound", component: NotFoundView }
]

// Define no redirect routes
const NoRedirectRoutes : RouteRecordName[] = ["Login", "NotFound"]
const ProtectedRoutes : RouteRecordName[] = []

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Authentification to protect logged pages

// router.beforeEach(async (to) => {
//     const token = localStorage.getItem("token")
//     if (!token && to.name && !NoRedirectRoutes.includes(to.name)
//     ) {
//         return { name: 'Login' }
//     }
// })

export default router