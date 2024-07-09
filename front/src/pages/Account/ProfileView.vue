<script setup lang="ts"></script>
<template>
  <div class="container">
    <p class="text-h4">Profil</p>
    <v-container>
      <v-row class="gap-y-6 md:gap-y-7 md:mt-7">
        <!-- Personal Information Card -->
        <v-col class="md:col-span-2 lg:col-span-6">
          <v-card class="bg-paper-primary-light shadow-short rounded-lg">
            <v-card-text
              class="p-4 mb-8 bg-white md:h-full md:mb-0 md:p-6 md:rounded-2"
            >
              <h2 class="mb-2 title-2">Informations personnelles</h2>
              <div class="flex items-center">
                <div class="body-1-light">
                  <div>Shen Dan</div>
                  <div>shensport@protonmail.com</div>
                  <div></div>
                  <div>
                    <v-btn text class="my-3 underline font-bold">
                      Modifier mon mot de passe
                    </v-btn>
                  </div>
                  <div>
                    <v-btn
                      text
                      class="underline font-bold"
                      href="/fr-fr/dashboard/profile/delete-account"
                    >
                      Supprimer mon compte
                    </v-btn>
                  </div>
                </div>
                <v-btn icon class="ml-auto">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Billing Address Card -->
        <v-col class="md:col-span-2 lg:col-span-6">
          <v-card class="bg-paper-primary-light shadow-short rounded-lg">
            <v-card-text
              class="p-4 mb-8 bg-white md:h-full md:mb-0 md:p-6 md:rounded-2"
            >
              <h2 class="mb-2 title-2">Adresse de facturation</h2>
              <div class="flex items-center">
                <div class="body-1-light">
                  <span>Vous n’avez renseigné aucune adresse.</span>
                </div>
                <v-btn icon class="ml-auto" @click="editBillingAddress">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
