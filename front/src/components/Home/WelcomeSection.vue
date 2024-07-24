<script setup lang="ts">
import Button from "@/components/Button.vue";
</script>

<template>
  <section class="container">
    <img
      class="welcome-background"
      src="../../assets/Home/macbook-welcome-section.avif"
      alt="Welcome background image - macbook pro"
    />
    <p class="welcome-message">Trouvez ce dont vous avez besoin.</p>
    <RouterLink to="/products">
      <Button class="discover-button" content="Commencer à explorer" />
    </RouterLink>
  </section>
</template>

<style scoped>
.container {
  height: calc(100vh - 70px);
  position: relative;
}

.welcome-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-message {
  font-size: 35px;
  color: white;
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
}

.discover-button {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
}
</style>
