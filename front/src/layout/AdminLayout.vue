<script setup lang="ts">
import { logoutUser } from "@/api/auth";
import { useUserStore } from "@/store/UserStore";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VListItem } from "vuetify/components";

const drawer = ref(null);
const items = ref([
  { icon: "fa-solid fa-table", title: "Dashboard", route: "/admin" },
  { icon: "fa-solid fa-user", title: "Utilisateurs", route: "/admin/users" },
  {
    icon: "fa-solid fa-address-book",
    title: "Adresses",
    route: "/admin/addresses",
  },
  { icon: "fa-solid fa-box", title: "Commandes", route: "/admin/orders" },
  {
    icon: "fa-solid fa-file-invoice",
    title: "Factures",
    route: "/admin/invoices",
  },
]);

const route = useRoute();
const router = useRouter();
const store = useUserStore();

const isRouteActive = (routeName: string) => computed(() => route.path === routeName);

const logout = async () => {
  await logoutUser();
  await router.push({
    name: "Login",
    replace: true,
  });
  store.setUser(null);
};
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" app color="tertiary" rail rail-width="80">
      <v-avatar class="d-block text-center mx-auto mt-4 mb-16 logo" size="40">
        TH
      </v-avatar>
      <v-list variant="flat" nav class="mt-16">
        <VListItem
          v-for="(item, i) in items"
          :key="i"
          :ripple="false"
          style="
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
          "
          :class="isRouteActive(item.route).value ? 'border' : ''"
          @click="$router.push(item.route)"
        >
          <v-tooltip activator="parent" location="end">{{ item.title }}</v-tooltip>
          <v-icon color="white" class="icon">{{ item.icon }}</v-icon>
        </VListItem>
      </v-list>

      <div
        style="
          position: absolute;
          width: 100%;
          bottom: 0px;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          right: 0;
          text-align: center;
        "
      >
        <v-list variant="flat" nav class="mt-16">
          <VListItem
            style="
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            :ripple="false"
          >
            <v-tooltip activator="parent" location="end">Paramètres</v-tooltip>
            <v-icon color="white" class="icon">fas fa-cog </v-icon>
          </VListItem>
          <VListItem
            style="
              background-color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            "
            @click="logout"
            :ripple="false"
          >
            <v-tooltip activator="parent" location="end">Se déconnecter</v-tooltip>
            <v-icon color="white icon">fa-solid fa-right-from-bracket </v-icon>
          </VListItem>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-main style="min-height: 100vh">
      <div class="container">
        <router-view></router-view>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.container {
  padding: 0.75rem 1rem;
  height: 100%;
  width: 100%;
}
.border {
  text-decoration: none;
  background: #529dff !important;
}
.logo {
  font-weight: bold;
  font-size: 20px;
  color: white;
}

.hover:hover {
  background: #529dff !important;
  text-decoration: none;
}

.icon {
  font-size: 18px;
}
</style>
