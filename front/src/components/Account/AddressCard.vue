<script setup lang="ts">
import { deleteAddress, updateAddress } from "@/api/address";
import { getUserInformation } from "@/api/auth";
import type { Address } from "@/interfaces/Address";
import { useUserStore } from "@/store/UserStore";
import { toast } from "vue3-toastify";

interface Props {
  address: Address;
}

const props = defineProps<Props>();
const { setUser } = useUserStore();

const handleDeleteAddress = async () => {
  try {
    await deleteAddress(props.address.id);
    const { data } = await getUserInformation();
    setUser(data);
    toast.success("Adresse supprimée avec succès");
  } catch (error: any) {
    console.error(error);
    toast.error("Une erreur est survenue lors de la suppression de l'adresse");
  }
};

const updateAddressSelection = async () => {
  try {
    await updateAddress({
      id: props.address.id,
      data: {
        ...props.address,
        is_selected: true,
      },
      config: {},
    });
    const { data } = await getUserInformation();
    setUser(data);
  } catch (error: any) {
    console.error(error);
    toast.error("Une erreur est survenue lors de la sélection");
  }
};
</script>
<template>
  <v-card
    variant="outlined"
    class="card-custom"
    :style="{
      borderColor: address.is_selected ? '#3281ED' : 'rgba(0, 0, 0, 0.12)',
      borderWidth: address.is_selected ? '2px' : '1px',
    }"
  >
    <v-card-item class="item">
      <p>{{ address.country }}</p>
      <p>{{ address.address }}</p>
      <p>{{ address.other }}</p>
      <p>{{ address.city }}</p>
      <p>{{ address.postal_code }}</p>
    </v-card-item>

    <v-card-actions>
      <v-btn
        class="text-primary ps-2 text-button text-caption"
        variant="plain"
        @click="handleDeleteAddress"
        >Effacer</v-btn
      >
      <v-spacer />

      <v-btn
        class="text-primary ps-2 text-button text-caption"
        variant="plain"
        :disabled="address.is_selected"
        @click="updateAddressSelection"
        >Définir par défaut</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card-custom {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  height: 300px;
  width: 324px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.875rem;
  background: white;
  @media (max-width: 700px) {
    width: 100%;
  }
}

.item {
  & div.v-card-item__content {
    width: 100%;
  }
}
</style>
