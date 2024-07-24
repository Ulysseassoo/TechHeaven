<script setup lang="ts">
import Button from "@/components/Button.vue";
import type { Category } from "@/interfaces/Category";
import { onMounted, ref } from "vue";
import { getCategories } from "@/api/category";

const categories = ref<Category[]>([]);

const fetchCategories = async () => {
  try {
    const result = await getCategories({
      limit: 100,
    });
    categories.value = result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

onMounted(() => fetchCategories());

const email = ref(null);

const legacyLinks = [
  {
    title: "A propos de nous",
    items: [
      { label: "Accueil", link: "/" },
      { label: "Nos produits", link: "/products" },
    ],
  },
  {
    title: "Termes",
    items: [
      { label: "Politique de confidentialité", link: "/privacy-policy" },
      { label: "Conditions générales", link: "/terms" },
      { label: "Politique du droit d'auteur", link: "/copywright-policy" },
      { label: "CGV", link: "/cgv" },
    ],
  },
  {
    title: "Produits",
    items: [
      { label: "Catégories", link: "/products?category=all" },
      { label: "Promotions", link: "/products?promo=true" },
      { label: "Nouveau produits", link: "/products?new=true" },
    ],
  },
];
</script>

<template>
  <footer>
    <section class="links-section">
      <h2>Découvrez nos produits par catégories :</h2>

      <div class="links">
        <template v-for="(item, index) in categories" :key="item.id">
          <RouterLink :to="`/products?category=${item.name}`">{{ item.name }}</RouterLink>
          <span v-if="index !== categories.length - 1">-</span>
        </template>
      </div>
    </section>

    <section class="mail-section">
      <div style="margin-bottom: 20px">
        <img width="200px" src="../assets/logo.png" alt="" />
      </div>
      <div class="newsletter">
        <div>
          <h2>Rejoignez notre newsletter</h2>
          <p style="font-size: 12px; font-weight: 500">
            Nous envoyons des emails seulement si vous le demandez, nous ne vous ferons
            pas de spam, c&apos;est promis !
          </p>
        </div>
        <div class="newsletter-input">
          <VTextField
            variant="outlined"
            label="Entrez votre adresse email"
            class="mr-2"
            v-model="email"
            :error="false"
            type="input"
            :hide-details="true"
            density="compact"
            style="min-width: 150px"
          />
          <Button content="Souscrire" />
        </div>
      </div>
    </section>

    <section class="help-links">
      <div v-for="(legacy, index) in legacyLinks" :key="index">
        <h3>{{ legacy.title }}</h3>
        <div class="help-underlink">
          <RouterLink
            v-for="(item, index) in legacy.items"
            :key="index"
            :to="item.link"
            >{{ item.label }}</RouterLink
          >
        </div>
      </div>
    </section>

    <p class="copyright">© Copyright 2024, Tous droits réservés.</p>
  </footer>
</template>

<style scoped>
.links-section {
  background: white;
  padding: 25px;
}

h2 {
  font-size: 15px;
}

.links {
  margin-top: 25px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.links > a {
  text-decoration: none;
  color: black;
  font-weight: 600;
}

.mail-section {
  padding: 25px;
}

.newsletter {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 50px;
}
.newsletter-input {
  display: flex;
  align-items: center;
  flex: 1;
}

.help-links {
  border: solid 1px #858585;
  border-left: none;
  border-right: none;
  margin: 0 25px;
  margin-top: 20px;
  padding: 40px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

h3 {
  margin-bottom: 10px;
  font-weight: 600;
}
.help-underlink {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.help-underlink a {
  text-decoration: none;
  color: #626262;
  font-size: 12px;
}

.copyright {
  text-align: center;
  margin: 10px 0;
  font-size: 12px;
  font-weight: 600;
}
</style>
