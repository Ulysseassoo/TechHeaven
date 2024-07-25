<script setup lang="ts">
import { useForm } from "@/hooks/useForm";
import { z } from "zod";
import { useUserStore } from "@/store/UserStore";
import { createOrder } from "@/api/order";
import { createInvoice } from "@/api/invoice";
import { getPaymentLink } from "@/api/payment";

const validationSchema = z.object({
  firstname: z.string().min(1, "Le nom de famille doit être renseigné"),
  lastname: z.string().min(1, "Le prénom doit être renseigné"),
  street: z.string().min(1, "L'adresse doit être renseigné"),
  city: z.string().min(1, "La ville doit être renseigné"),
  postalCode: z.string().min(1, "Le code postal doit être renseigné"),
  other: z.string().optional(),
});

const userStore = useUserStore();
const { user } = userStore;

const addresseSelected = user?.addresses.filter(
  (address) => address.is_selected,
);

const initialValues = {
  firstname: user?.firstname ?? "",
  lastname: user?.lastname ?? "",
  street: addresseSelected !== undefined ? addresseSelected[0].address : "",
  city: addresseSelected !== undefined ? addresseSelected[0].city : "",
  postalCode:
    addresseSelected !== undefined ? addresseSelected[0].postal_code : "",
  other: addresseSelected !== undefined ? addresseSelected[0].other : "",
};

const onSubmit = async () => {
  try {
    const order = await createOrder();
    await createInvoice(order.data.id);
    const paymentLink = await getPaymentLink();
    window.location.replace(paymentLink.data.link);
  } catch (error) {
    throw error;
  }
};

const { data, handleSubmit, isSubmitting, errors, validateField } = useForm({
  initialValues,
  validationSchema,
  onSubmit,
});
</script>
<template>
  <section class="order-detail-container">
    <div class="order-detail-products">
      <h1>Informations livraison</h1>
      <div class="order-details">
        <VForm @submit.prevent="handleSubmit">
          <VTextField
            variant="outlined"
            label="Nom de famille"
            v-model="data.firstname"
            :error="!!errors.firstname"
            :error-messages="errors.firstname"
            type="text"
            @input="validateField('firstname')"
            class="mb-3"
          />

          <VTextField
            variant="outlined"
            label="Prénom"
            v-model="data.lastname"
            :error="!!errors.lastname"
            :error-messages="errors.lastname"
            type="text"
            @input="validateField('lastname')"
          />

          <VTextField
            variant="outlined"
            label="Numéro d'adresse"
            v-model="data.street"
            :error="!!errors.street"
            :error-messages="errors.street"
            type="text"
            @input="validateField('street')"
          />

          <VTextField
            variant="outlined"
            label="Ville"
            v-model="data.city"
            :error="!!errors.city"
            :error-messages="errors.city"
            type="text"
            @input="validateField('city')"
          />

          <VTextField
            variant="outlined"
            label="Code postal"
            v-model="data.postalCode"
            :error="!!errors.postalCode"
            :error-messages="errors.postalCode"
            type="text"
            @input="validateField('postalCode')"
          />

          <VTextField
            variant="outlined"
            label="Adresse"
            v-model="data.other"
            :error="!!errors.other"
            :error-messages="errors.other"
            type="text"
            @input="validateField('other')"
          />

          <VBtn
            color="primary"
            height="55px"
            width="100%"
            flat
            type="submit"
            :loading="isSubmitting"
            >Passer au paiement</VBtn
          >
        </VForm>
      </div>
    </div>
  </section>
</template>
<style scoped>
.order-detail-container {
  padding: 40px 40px;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.order-detail-products {
  padding-bottom: 50px;
}

.order-detail-more {
  border-bottom: solid 1px rgba(40, 5, 5, 0.5);
  padding: 50px 0;
}

.order-detail-advantages {
  padding-top: 50px;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h1 {
  margin-bottom: 25px;
  font-size: 25px;
}

.order-more-products {
  display: flex;
  gap: 25px;
}
</style>
