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
      <p class="text-h6">Society's identity</p>

      <span>
        <ul>
          <li>Society's name : Tech Heaven</li>
          <li>Company's type : SARL</li>
          <li>Address of the head office : 19 Avenue des Champs, 75018</li>
          <li>Society's number : +336292929</li>
          <li>Society's Name : support@tech-heaven.fr</li>
        </ul>

        <br />
        <br />
        <p class="text-h6">Site Hosting</p>
        <ul>
          <li>Name of host: OVH</li>
          <li>Address: 2 Rue Kellermann</li>
          <li>Phone number: 0972101007</li>
        </ul>

        <br />
        <br />
        <p class="text-h6">Intellectual property</p>
        All content on the Tech Heaven site is the exclusive property of Tech
        Heaven or its partners. Any reproduction, distribution, modification or
        use of these contents without prior written permission is strictly
        prohibited.
        <br />
        <br />

        <p class="text-h6">Personal data protection</p>
        In accordance with the GDPR, Tech Heaven collects and processes personal
        data for the management of its customers. You have the right to access,
        correct and delete your data. To exercise these rights, please contact
        us at support@tech-heaven.fr.
      </span>
    </div>
  </v-container>
  <Footer />
</template>
