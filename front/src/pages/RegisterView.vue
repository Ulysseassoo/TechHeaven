<script setup lang="ts">
import DividerWithText from "../components/DividerWithText.vue";
import ArrowLeft from "../components/Icons/ArrowLeft.vue";
import RegisterForm from "../components/Auth/RegisterForm.vue";
import Stack from "../components/Stack.vue";
import Google from "../components/Icons/Google.vue";
import Apple from "../components/Icons/Apple.vue";
import Facebook from "../components/Icons/Facebook.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigateBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="container">
    <div class="image-container">
      <img src="../assets/login.jpg" />
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
        <DividerWithText container-class="mt-12 mb-8 relative" content="Continue With" />
        <Stack align="center" justify="center" direction="row" margin="1rem" gap="1.2rem">
          <VBtn
            flex="1"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="
              text-transform: none;
              align-items: center;
              justify-content: center;
              display: flex;
            "
          >
            <Google width="30px" height="30px" />
          </VBtn>
          <VBtn
            flex="1"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="
              text-transform: none;
              align-items: center;
              justify-content: center;
              display: flex;
            "
          >
            <Apple width="30px" height="30px" />
          </VBtn>
          <VBtn
            flex="1"
            height="55px"
            flat
            color="primary"
            variant="outlined"
            style="
              text-transform: none;
              align-items: center;
              justify-content: center;
              display: flex;
            "
          >
            <Facebook width="30px" height="30px" />
          </VBtn>
        </Stack>
        <DividerWithText
          container-class="mt-8 mb-12 relative"
          content="Or log yourself"
        />
        <RegisterForm />
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
    max-width: 600px;
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
