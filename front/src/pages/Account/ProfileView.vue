<script setup lang="ts">
import { useUserStore } from "@/store/UserStore";
import { RouterLink } from "vue-router";
const store = useUserStore();
const { user } = store;
console.log("🚀 ~ user:", user);
</script>
<template>
  <div class="container">
    <p class="text-h4">Profil</p>
    <v-container>
      <v-row class="gap-y-6 md:gap-y-7 md:mt-7">
        <v-col class="md:col-span-2 lg:col-span-6">
          <v-card
            class="bg-paper-primary-light shadow-short rounded-lg"
            title="Informations personnelles"
            subtitle="Modifier les informations personnelles"
          >
            <template v-slot:append>
              <v-icon class="cursor-pointer" icon="fa-solid fa-pen"></v-icon>
            </template>
            <v-card-text class="p-4 mb-8 bg-white md:h-full md:mb-0 md:p-6 md:rounded-2">
              <div class="flex items-center">
                <div class="body-1-light">
                  <div>{{ user?.firstname }} {{ user?.lastname }}</div>
                  <div>{{ user?.email }}</div>
                </div>
              </div>
              <div class="d-flex ga-1 flex-column mt-2">
                <p
                  class="text-decoration-underline font-weight-bold cursor-pointer w-auto align-self-start"
                >
                  Modifier mon mot de passe
                </p>
                <RouterLink
                  to="/account/ cursor-pointerdelete"
                  class="text-decoration-underline font-weight-bold w-auto align-self-start"
                  >Supprimer mon compte</RouterLink
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
