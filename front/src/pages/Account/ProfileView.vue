<script setup lang="ts">
import { useUserStore } from "@/store/UserStore";
import EditUserInformationsCard from "@/components/Account/EditUserInformationsCard.vue";
import PreferencesCard from "@/components/Account/PreferencesCard.vue";
import type { User } from "@/interfaces/User";
import { computed } from "vue";
const store = useUserStore();
const user = computed(() => store.user as User);
</script>
<template>
  <div class="container">
    <p class="text-h4">Profil</p>
    <v-container>
      <v-row class="gap-y-6 md:gap-y-7 md:mt-7">
        <v-col cols="12" sm="6">
          <EditUserInformationsCard :user="user" />
        </v-col>
        <v-col cols="12" sm="6">
          <PreferencesCard :user="user" />
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

.link {
  color: black;
}
</style>
