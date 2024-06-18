<script setup lang="ts">
import { ref } from "vue";
import Button from "./Button.vue";

const email = ref(null);
</script>

<template>
  <footer>
    <section class="links-section">
      <h2>Découvrez nos produits par catégories :</h2>

      <div class="links">
        <RouterLink to="/">Smartphones</RouterLink>
        <span>-</span>
        <RouterLink to="/">Télévisions</RouterLink>
        <span>-</span>
        <RouterLink to="/">Tablettes</RouterLink>
        <span>-</span>
        <RouterLink to="/">Promotions</RouterLink>
        <span>-</span>
        <RouterLink to="/">Montres</RouterLink>
        <span>-</span>
        <RouterLink to="/">Écouteurs & Casques</RouterLink>
        <span>-</span>
        <RouterLink to="/">Clavier & souris</RouterLink>
        <span>-</span>
        <RouterLink to="/">Ordinateurs</RouterLink>
        <span>-</span>
        <RouterLink to="/">Accessoires</RouterLink>
        <span>-</span>
        <RouterLink to="/">Photos & vidéos</RouterLink>
      </div>
    </section>

    <section class="mail-section">
      <div style="margin-bottom: 20px">
        <img width="200px" src="../assets/logo.png" alt="" />
      </div>
      <div class="newsletter">
        <div>
          <h2>Join our newsletter</h2>
          <p>
            We do send emails only if you ask for it, we will not spam you, it's
            promise !
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
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
        </div>
      </div>
      <div>
        <h3>About Us</h3>
        <div>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
          <p>Who we are ?</p>
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
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}

h3 {
  margin-bottom: 10px;
}
h3 div {
  color: #626262;
  font-size: 12px;
}

.copyright {
  text-align: center;
  margin: 10px 0;
}
</style>
