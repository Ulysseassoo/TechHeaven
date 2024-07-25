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
import CategoriesView from "@/pages/Admin/CategoriesView.vue";
import AlertsView from "@/pages/Admin/AlertsView.vue";
import ProductView from "@/pages/ProductView.vue";
import BasketView from "@/pages/BasketView.vue";
import AdminLayout from "@/layout/AdminLayout.vue";
import StoreKeeperLayout from "@/layout/StoreKeeperLayout.vue";
import AccountLayout from "@/layout/AccountLayout.vue";
import DashboardView from "@/pages/DashboardView.vue";
import KeeperDashboardView from "@/pages/KeeperDashboardView.vue";
import ProfileView from "@/pages/Account/ProfileView.vue";
import UserAddressesView from "@/pages/Account/UserAddressesView.vue";
import UserOrdersView from "@/pages/Account/UserOrdersView.vue";
import ProductsView from "@/pages/Admin/ProductsView.vue";
import DeleteAccountView from "@/pages/Account/DeleteAccountView.vue";
import PrivacyPolicyView from "@/pages/PrivacyPolicyView.vue";
import ConfidentialityView from "@/pages/ConfidentialityView.vue";
import CopywrightPolicyView from "@/pages/CopywrightPolicyView.vue";
import OrderView from "@/pages/OrderView.vue";
import ProductDetailView from "@/pages/ProductDetailView.vue";
import PaymentSuccessView from "@/pages/PaymentSuccessView.vue";
import CgvView from "@/pages/CgvView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  { path: "/products", name: "ProductsGuest", component: ProductView },
  { path: "/basket", name: "Basket", component: BasketView },
  { path: "/order", name: "Order", component: OrderView },
  {
    path: "/product-detail",
    name: "ProductDetail",
    component: ProductDetailView,
  },
  {
    path: "/payment/success",
    name: "PaymentSuccess",
    component: PaymentSuccessView,
  },
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
        path: "categories",
        name: "Categories",
        component: CategoriesView,
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
      {
        path: "alerts",
        name: "Alerts",
        component: AlertsView,
      },
      {
        path: "products",
        name: "Products",
        component: ProductsView,
      },
    ],
  },
  {
    path: "/keeper",
    name: "Keeper",
    component: StoreKeeperLayout,
    meta: { requiresAuth: true, role: "ROLE_STORE_KEEPER" },
    children: [
      {
        path: "",
        name: "OverviewStock",
        component: KeeperDashboardView,
      },
      {
        path: "stock",
        name: "stock",
        component: ProductsView,
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
      {
        path: "orders",
        name: "UserOrders",
        component: UserOrdersView,
      },
      {
        path: "addresses",
        name: "UserAddresses",
        component: UserAddressesView,
      },
      {
        path: "delete-account",
        name: "Delete Account",
        component: DeleteAccountView,
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
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicyView,
  },
  {
    path: "/terms",
    name: "TermsOfService",
    component: ConfidentialityView,
  },
  {
    path: "/cgv",
    name: "CGB",
    component: CgvView,
  },
  {
    path: "/copywright-policy",
    name: "CopywrightPolicy",
    component: CopywrightPolicyView,
  },
  { path: "/:pathMatch(.*)", name: "NotFound", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
