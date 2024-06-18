import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import HomeView from './pages/HomeView.vue'
import LoginView from './pages/LoginView.vue'
import RegisterView from './pages/RegisterView.vue'
import NotFoundView from './pages/NotFoundView.vue'
import ConfirmationView from './pages/ConfirmationView.vue'
import ResetPasswordView from "./pages/ResetPasswordView.vue"
import DashboardView from "./pages/DashboardView.vue"
import UsersView from "./pages/Admin/UsersView.vue"
import AdminLayout from "./layout/AdminLayout.vue"
import { getUserInformation } from "./api/auth"

const routes: RouteRecordRaw[] = [
    { path: '/', name: "Home", component: HomeView },
    {
        path: "/admin", name: "Admin", component: AdminLayout, meta: { requiresAuth: true, role: "ROLE_ADMIN" }, children: [
            {
                path: "",
                name: "Dashboard",
                component: DashboardView,
            },
            {
                path: "users",
                name: "Users",
                component: UsersView,
            },
            {
                path: "orders",
                name: "Orders",
                component: DashboardView,
            },
            {
                path: "invoices",
                name: "Invoices",
                component: DashboardView,
            }
        ]
    },
    { path: '/login', name: "Login", component: LoginView, props: (route) => route.query.hasConfirmedAccount },
    { path: '/register', name: "Register", component: RegisterView },
    { path: '/confirmation', name: "Confirmation", component: ConfirmationView },
    { path: '/forgot-password', name: "ResetPassword", component: ResetPasswordView },
    { path: '/:pathMatch(.*)', name: "NotFound", component: NotFoundView }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth) {
        if (!token) {
            next({ name: 'Login' })
        } else {
            const response = await getUserInformation()
            if (response.status === 401) {
                next({ name: 'Login' })
            }
            if (response.data.role === to.meta.role) {
                next()
            } else {
                next({ name: 'Home' })
            }
        }
    } else {
        next()
    }
})

export default router