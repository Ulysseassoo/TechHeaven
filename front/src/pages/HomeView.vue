<script setup lang="ts">
import Header from "../components/Header.vue";
import WelcomeSection from "../components/Home/WelcomeSection.vue";
import NewProducts from "../components/Home/NewProducts.vue";
import MostSells from "../components/Home/MostSells.vue";
import FeedbackSection from "../components/Home/FeedbackSection.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <section class="container">
    <Header />
    <WelcomeSection />
    <NewProducts />
    <MostSells />
    <FeedbackSection />
    <Footer />
  </section>
</template>

<style scope>
.container {
  background: #f8f9fc;
}
</style>
