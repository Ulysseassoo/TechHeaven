<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/Button.vue";

const email = ref(null);

const links = [
  {
    url: "/",
    label: "Smartphones",
  },
  {
    url: "/",
    label: "Télévisions",
  },
  {
    url: "/",
    label: "Tablettes",
  },
  {
    url: "/",
    label: "Promotions",
  },
  {
    url: "/",
    label: "Montres",
  },
  {
    url: "/",
    label: "Écouteurs & Casques",
  },
  {
    url: "/",
    label: "Clavier et souris",
  },
  {
    url: "/",
    label: "Ordinateurs",
  },
  {
    url: "/",
    label: "Accesssoires",
  },
  {
    url: "/",
    label: "Photos & Vidéos",
  },
];

const legacyLinks = [
  {
    title: "About us",
    items: [
      { label: "Who we are ?", link: "#" },
      { label: "Community", link: "#" },
      { label: "Contact us", link: "#" },
      { label: "Customer services", link: "#" },
      { label: "Support", link: "#" },
      { label: "Help", link: "#" },
    ],
  },
  {
    title: "Terms",
    items: [
      { label: "Privacy policy", link: "#" },
      { label: "Terms & conditions", link: "#" },
      { label: "Copyright policy", link: "#" },
      { label: "Security", link: "#" },
      { label: "Fees & charges", link: "#" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Categories", link: "#" },
      { label: "Promotions", link: "#" },
      { label: "New products", link: "#" },
    ],
  },
  {
    title: "Terms",
    items: [
      { label: "Privacy policy", link: "#" },
      { label: "Terms & conditions", link: "#" },
      { label: "Copyright policy", link: "#" },
      { label: "Security", link: "#" },
      { label: "Fees & charges", link: "#" },
    ],
  },
  {
    title: "About us",
    items: [
      { label: "Who we are ?", link: "#" },
      { label: "Community", link: "#" },
      { label: "Contact us", link: "#" },
      { label: "Customer services", link: "#" },
      { label: "Support", link: "#" },
      { label: "Help", link: "#" },
    ],
  },
  {
    title: "About us",
    items: [
      { label: "Who we are ?", link: "#" },
      { label: "Community", link: "#" },
      { label: "Contact us", link: "#" },
      { label: "Customer services", link: "#" },
      { label: "Support", link: "#" },
      { label: "Help", link: "#" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Categories", link: "#" },
      { label: "Promotions", link: "#" },
      { label: "New products", link: "#" },
    ],
  },
  {
    title: "Terms",
    items: [
      { label: "Privacy policy", link: "#" },
      { label: "Terms & conditions", link: "#" },
      { label: "Copyright policy", link: "#" },
      { label: "Security", link: "#" },
      { label: "Fees & charges", link: "#" },
    ],
  },
];
</script>

<template>
  <footer>
    <section class="links-section">
      <h2>Découvrez nos produits par catégories :</h2>

      <div class="links">
        <template v-for="(item, index) in links" :key="item.label">
          <RouterLink :to="item.url">{{ item.label }}</RouterLink>
          <span v-if="index !== links.length - 1">-</span>
        </template>
      </div>
    </section>

    <section class="mail-section">
      <div style="margin-bottom: 20px">
        <img width="200px" src="../assets/logo.png" alt="" />
      </div>
      <div class="newsletter">
        <div>
          <h2>Join our newsletter</h2>
          <p style="font-size: 12px; font-weight: 500">
            We do send emails only if you ask for it, we will not spam you, it's promise !
          </p>
        </div>
        <div class="newsletter-input">
          <VTextField
            variant="outlined"
            label="Qu'est ce que vous cherchez"
            v-model="email"
            :error="false"
            type="input"
            :hide-details="true"
            density="compact"
          />
          <Button content="Subscribe" />
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

    <p class="copyright">© Copyright 2024, all rights reserved</p>
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
}
.newsletter-input {
  display: flex;
  align-items: center;
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
