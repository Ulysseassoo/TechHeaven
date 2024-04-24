<script setup lang="ts">
import DividerWithText from "../components/DividerWithText.vue";
import ArrowLeft from "../components/Icons/ArrowLeft.vue";
import LoginForm from "../components/Login/LoginForm.vue";
import Stack from "../components/Stack.vue";
import Google from "../components/Icons/Google.vue";
import Apple from "../components/Icons/Apple.vue";
import Facebook from "../components/Icons/Facebook.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateBack = () => {
  console.log("hi")
  router.push("/")
}
</script>

<template>
  <div class="container">
    <Stack
      width="fit-content"
      cursor="pointer"
      align="center"
      justify="flex-start"
      direction="row"
      margin="0"
      gap="0.5rem"
    >
      <ArrowLeft height="15px" width="15px" />
      <span @click="navigateBack">Back to the website</span>
    </Stack>
    <h1>Welcome to our website !</h1>
    <DividerWithText container-class="mt-12 mb-8 relative" content="Continue With" />
    <Stack align="center" justify="center" direction="column" margin="1rem" gap="1.2rem">
      <VBtn width="100%" height="55px" flat color="primary" variant="outlined" style="text-transform: none;">
        Login with Google
        <template v-slot:prepend>
          <Google width="25px" height="25px" />
        </template>
      </VBtn>
      <VBtn width="100%" height="55px" flat color="primary" variant="outlined" style="text-transform: none;">
        <template v-slot:prepend>
          <Apple width="25px" height="25px" />
        </template>
        Login with Apple</VBtn
      >
      <VBtn width="100%" height="55px" flat color="primary" variant="outlined" style="text-transform: none;">
        <template v-slot:prepend>
          <Facebook width="25px" height="25px" />
        </template>
        Login with Facebook</VBtn
      >
    </Stack>
    <DividerWithText container-class="mt-8 mb-12 relative" content="Or log yourself" />
    <LoginForm />
  </div>
</template>

<style>
.container {
  padding: 1rem;
  font-size: 0.9rem;
  h1 {
    margin-top: 0.2rem;
    font-size: 1.3rem;
    font-weight: 700;
  }
}
</style>
