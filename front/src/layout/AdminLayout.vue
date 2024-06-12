<script setup="ts">
import { computed, ref } from "vue";
import { VListGroup, VListItem } from "vuetify/components";

const selectedItem = ref(0);
const drawer = ref(null);
const items = ref([
  { icon: "fa-solid fa-table", title: "Dashboard" },
  { icon: "fa-solid fa-user", title: "Utilisateurs" },
  { icon: "fa-solid fa-box", title: "Commandes" },
  { icon: "fa-solid fa-file-invoice", title: "Factures" },
]);
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" app color="#2784ff" rail rail-width="80">
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
          :class="selectedItem === i ? 'border' : ''"
          @click="selectedItem = i"
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
            "
            :ripple="false"
          >
          <v-tooltip activator="parent" location="end"
              >Se déconnecter</v-tooltip
            >
          <v-icon color="white icon"
            >fa-solid fa-right-from-bracket
            </v-icon
          >
          </VListItem>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-main class="" style="min-height: 300px">
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<style scoped>
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
