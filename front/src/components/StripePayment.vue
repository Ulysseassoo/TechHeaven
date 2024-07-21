<template>
  <div>
    <button @click="handlePayment">Payer</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

export default defineComponent({
  name: "StripePayment",
  props: {
    clientSecret: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const stripe = ref<Stripe | null>(null);
    const cardElement = ref<any | null>(null);

    onMounted(async () => {
      stripe.value = await loadStripe("pk_test_TJk0aw2sfo1t8MbZcbJ1ZQ0c00DP4rASiG"); //clé publique Stripe
      if (stripe.value) {
        const elements = stripe.value.elements();
        cardElement.value = elements.create("card");
        cardElement.value.mount("#card-element");
      }
    });

    const handlePayment = async () => {
      if (!stripe.value || !cardElement.value) {
        console.error("Stripe ou CardElement non initialisé");
        return;
      }

      const { error, paymentIntent } = await stripe.value.confirmCardPayment(
        props.clientSecret,
        {
          payment_method: {
            card: cardElement.value,
            billing_details: {
              name: "Nom du client",
            },
          },
        }
      );

      if (error) {
        console.error("Erreur de paiement:", error.message);
      } else {
        console.log("Paiement réussi!", paymentIntent);
        // Redirection après paiement réussi
      }
    };

    return {
      handlePayment,
      cardElement,
    };
  },
});
</script>

<style scoped>
#card-element {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}
</style>
