<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <Header />
  <v-container>
    <h1 class="text-h3">Mentions Légales</h1>
    <h2 class="text-h5">Tech Heaven</h2>

    <div class="mt-4 mb-12">
      <p class="text-h6">Identité de la société</p>

      <span>
        <ul>
          <li>Nom de la société : Tech Heaven</li>
          <li>Type d'entreprise : SARL</li>
          <li>Siège social : 19 Avenue des Champs, 75018</li>
          <li>Numéro de téléphone : 0922108807</li>
          <li>Email de la société : support@tech-heaven.fr</li>
        </ul>

        <br />
        <br />
        <p class="text-h6">Hébergeur</p>
        <ul>
          <li>Nom: OVH</li>
          <li>Adresse: 2 Rue Kellermann</li>
          <li>Numéro de téléphone: 0972101007</li>
        </ul>

        <br />
        <br />
        <p class="text-h6">Propriété intellectuelle</p>
        Tout le contenu du site de Tech Heaven est la propriété exclusive de TechHeaven ou
        de ses partenaires. Toute reproduction, distribution, modification ou utilisation
        de ces contenus sans autorisation écrite préalable est strictement interdite.
        <br />
        <br />

        <p class="text-h6">Protection des données personnelles</p>
        Conformément au RGPD, Tech Heaven collecte et traite les données personnelles pour
        la gestion de ses clients. Vous avez le droit d&apos;accéder à vos données, de les
        corriger et de les supprimer. Pour exercer ces droits, veuillez nous contacter à
        l&apos;adresse support@tech-heaven.fr.
      </span>
    </div>
  </v-container>
  <Footer />
</template>
