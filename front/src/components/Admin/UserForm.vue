<script setup lang="ts"></script>

<template>
  <v-row dense>
    <v-col cols="12" md="4" sm="6">
      <v-text-field label="First name*" required></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field
        hint="example of helper text only on focus"
        label="Middle name"
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field
        hint="example of persistent helper text"
        label="Last name*"
        persistent-hint
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field label="Email*" required></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field label="Password*" type="password" required></v-text-field>
    </v-col>

    <v-col cols="12" md="4" sm="6">
      <v-text-field label="Confirm Password*" type="password" required></v-text-field>
    </v-col>

    <v-col cols="12" sm="6">
      <v-select
        :items="['0-17', '18-29', '30-54', '54+']"
        label="Age*"
        required
      ></v-select>
    </v-col>

    <v-col cols="12" sm="6">
      <v-autocomplete
        :items="[
          'Skiing',
          'Ice hockey',
          'Soccer',
          'Basketball',
          'Hockey',
          'Reading',
          'Writing',
          'Coding',
          'Basejump',
        ]"
        label="Interests"
        auto-select-first
        multiple
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>
