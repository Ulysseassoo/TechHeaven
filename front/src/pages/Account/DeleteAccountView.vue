<script setup lang="ts">
import { logoutUser } from "@/api/auth";
import { deleteUser } from "@/api/user";
import { useUserStore } from "@/store/UserStore";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const disabled = ref(false);
const store = useUserStore();
const user = computed(() => store.user);
const router = useRouter();
const loading = ref(false);

const handleDeleteAccount = async () => {
  loading.value = true;
  try {
    if (user.value !== null) {
      await deleteUser(user.value.id);
      await logoutUser();
      router.replace("/login");
    }
    loading.value = false;
  } catch (error) {
    console.log(error);
    loading.value = true;

    toast.error(
      "Une erreur est survenue lors de la suppression de votre compte. Veuillez réessayer plus tard."
    );
  }
};
</script>

<template>
  <v-container>
    <h1 class="text-h3">Supprimer mon compte</h1>
    <p class="text-h5 mt-4">Aucun retour en arrière n’est possible</p>

    <div class="mt-4">
      <span>
        La suppression de votre compte est une action permanente. Une fois votre compte
        supprimé, vous ne pouvez plus y accéder et il ne peut pas être restauré. Lors de
        la suppression de votre compte : <br />
        <ul class="list">
          <li>
            vous n’aurez plus accès aux informations et données stockées dans votre compte
            (y compris l’historique de vos messages après-vente, vos alertes, l’historique
            et les détails de vos commandes)
          </li>
          <li>vous cesserez de recevoir des communications de suivi,</li>
          <li>
            vous devrez créer un nouveau compte si vous souhaitez passer une nouvelle
            commande. Si vous cliquez sur « Supprimer le compte », vous serez
            automatiquement déconnecté de votre compte.
          </li>
        </ul>
      </span>
    </div>

    <div class="mt-4 label-custom">
      <v-checkbox
        label="Oui, je veux supprimer définitivement mon compte TechHeaven."
        v-model="disabled"
      ></v-checkbox>
    </div>

    <v-btn
      class="mt-2"
      size="large"
      color="danger"
      @click="handleDeleteAccount"
      :loading="loading"
      :disabled="!disabled"
      >Supprimer le compte</v-btn
    >

    <div class="mt-12">
      <p>
        Veuillez noter que des données spécifiques peuvent être conservées pendant une
        certaine période si un achat ou une revente a eu lieu. Pour plus de détails sur
        nos pratiques en matière de confidentialité des données, nous vous encourageons à
        visiter notre Plateforme et à consulter notre
        <RouterLink class="link" to="/legal/data-protection"
          >Politique de confidentialité</RouterLink
        >
        mise à jour.
      </p>
    </div>
  </v-container>
</template>
<style scoped>
.list {
  li {
    margin-left: 24px;
    margin-block: 8px;
  }
}

.label-custom,
.link {
  color: black;
}
</style>
