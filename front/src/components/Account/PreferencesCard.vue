<script setup lang="ts">
import { updateUserPreference } from "@/api/user";
import { AlertTypes, type Preference } from "@/interfaces/Preference";
import type { User } from "@/interfaces/User";
import { useUserStore } from "@/store/UserStore";
import { computed } from "vue";

const props = defineProps<{ user: User }>();

const user = computed(() => props.user);

const store = useUserStore()

const togglePreference = async (preference: Preference) => {
  try {
    await updateUserPreference({
      userId: props.user.id,
      preferenceId: preference.id,
      alertId: preference.alert_id,
    })

    store.setUser({
      ...user.value,
      preferences: user.value.preferences.map((p) =>
        p.id === preference.id? {...p, isEnabled: !p.isEnabled } : p
      ),
    })
  } catch (error: any) {
    console.error("Error toggling preference:", error.message);
  }
};
</script>

<template>
  <v-card
    class="uniform-v-card-height bg-paper-primary-light shadow-short rounded-lg"
    title="Préférences en matière d'e-mail"
    subtitle="Modifier vos préférences d'alertes par e-mail"
  >
    <v-card-text class="p-4 mb-8 bg-white md:h-full md:mb-0 md:p-6 md:rounded-2">
      <div v-for="preference in user.preferences" :key="preference.id">
        <v-switch
          :model-value="preference.isEnabled"
          color="success"
          @update:modelValue="togglePreference(preference)"
        >
          <template v-slot:label v-if="preference.alert.type === AlertTypes.NEWSLETTER">
            Recevoir notre newsletter.
          </template>
        </v-switch>
      </div>
    </v-card-text>
  </v-card>
</template>
<style scoped></style>
