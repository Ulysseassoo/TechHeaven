import { RouteRecordName, RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import HomeView from './pages/HomeView.vue'
import LoginView from './pages/LoginView.vue'
import RegisterView from './pages/RegisterView.vue'
import NotFoundView from './pages/NotFoundView.vue'
import ConfirmationView from './pages/ConfirmationView.vue'

const routes : RouteRecordRaw[] = [
    { path: '/', name: "Home", component: HomeView },
    { path: '/login', name: "Login", component: LoginView, props: (route) => route.query.hasConfirmedAccount },
    { path: '/register', name: "Register", component: RegisterView },
    { path: '/confirmation', name: "Confirmation", component: ConfirmationView },
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