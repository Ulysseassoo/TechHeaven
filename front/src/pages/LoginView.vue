<script setup lang="ts">
import DividerWithText from "@/components/DividerWithText.vue";
import ArrowLeft from "@/components/icons/ArrowLeftIcon.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
import Stack from "@/components/VStack.vue";
import Google from "@/components/icons/GoogleIcon.vue";
import Apple from "@/components/icons/AppleIcon.vue";
import Facebook from "@/components/icons/FacebookIcon.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <img src="@/assets/login.jpg" />
    </div>
    <div class="superior-container">
      <div class="login-container">
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
        <DividerWithText
          container-class="mt-12 mb-8 relative"
          content="Continue With"
        />
        <Stack
          align="center"
          justify="center"
          direction="column"
          margin="1rem"
          gap="1.2rem"
        >
          <VBtn
            width="100%"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="text-transform: none"
          >
            Login with Google
            <template v-slot:prepend>
              <Google width="25px" height="25px" />
            </template>
          </VBtn>
          <VBtn
            width="100%"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="text-transform: none"
          >
            <template v-slot:prepend>
              <Apple width="25px" height="25px" />
            </template>
            Login with Apple</VBtn
          >
          <VBtn
            width="100%"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="text-transform: none"
          >
            <template v-slot:prepend>
              <Facebook width="25px" height="25px" />
            </template>
            Login with Facebook</VBtn
          >
        </Stack>
        <DividerWithText
          container-class="mt-8 mb-12 relative"
          content="Or log yourself"
        />
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  overflow: scroll;
  @media only screen and (max-width: 810px) {
    min-height: 100vh;
    overflow-y: scroll;
    align-items: center;
  }
}

.image-container {
  display: none;
  flex: 0;
  @media only screen and (min-width: 810px) {
    display: block;
    flex: 1;
    position: relative;
    img {
      object-fit: cover;
      object-position: center center;
      height: 100%;
      width: 100%;
    }
  }
}

.superior-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 2.4rem;
  @media only screen and (max-width: 600px) {
    padding: 00.2rem;
  }
  @media only screen and (min-width: 810px) {
    max-width: 700px;
  }
}

.login-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  font-size: 0.9rem;
  width: 100%;
  @media only screen and (min-width: 810px) {
    padding: 2.4rem;
  }
  h1 {
    margin-top: 0.2rem;
    font-size: 1.3rem;
    font-weight: 700;
  }
}
</style>
