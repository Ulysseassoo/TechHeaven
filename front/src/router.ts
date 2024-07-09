import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import HomeView from "@/pages/HomeView.vue";
import LoginView from "@/pages/LoginView.vue";
import RegisterView from "@/pages/RegisterView.vue";
import NotFoundView from "@/pages/NotFoundView.vue";
import ConfirmationView from "@/pages/ConfirmationView.vue";
import ResetPasswordView from "@/pages/ResetPasswordView.vue";
import UsersView from "@/pages/Admin/UsersView.vue";
import OrdersView from "@/pages/Admin/OrdersView.vue";
import InvoicesView from "@/pages/Admin/InvoicesView.vue";
import AddressesView from "@/pages/Admin/AddressesView.vue";
import AdminLayout from "@/layout/AdminLayout.vue";
import AccountLayout from "@/layout/AccountLayout.vue";
import DashboardView from "@/pages/DashboardView.vue";
import ProfileView from "@/pages/Account/ProfileView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: HomeView },
  {
    path: "/admin",
    name: "Admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "ROLE_ADMIN" },
    children: [
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
        path: "addresses",
        name: "Addresses",
        component: AddressesView,
      },
      {
        path: "orders",
        name: "Orders",
        component: OrdersView,
      },
      {
        path: "invoices",
        name: "Invoices",
        component: InvoicesView,
      },
    ],
  },
  {
    path: "/account",
    name: "Account",
    component: AccountLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "profile",
        name: "Profile",
        component: ProfileView,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    props: (route) => route.query.hasConfirmedAccount,
  },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/confirmation", name: "Confirmation", component: ConfirmationView },
  {
    path: "/forgot-password",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
  { path: "/:pathMatch(.*)", name: "NotFound", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
