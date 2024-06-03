<script setup lang="ts">
import { ref } from "vue";
import ResetPasswordForm from "./ResetPasswordForm.vue";
import VerificationCodeForm from "./VerificationCodeForm.vue";
import ChangePasswordForm from "./ChangePasswordForm.vue";
import { useRouter } from "vue-router";

const helperText = ref("");
const step = ref(0);
const userEmail = ref("");
const router = useRouter();

const handleStep = (num: number) => {
  step.value = num;
};

const resetPasswordOnNext = (email: string) => {
  helperText.value =
    "An email has been sent if we found the account, please fill the verification code before changing password.";
  handleStep(1);
  userEmail.value = email;
};

const verifcationCodeOnNext = () => {
  helperText.value = "You can now change your password.";
  handleStep(2);
};

const changePasswordOnSubmit = () => {
  helperText.value =
    "Your password has been changed. You will be redirected to the login page";
  setTimeout(() => {
    router.push("/login");
    userEmail.value = "";
    helperText.value = "";
  }, 4000);
};
</script>

<template>
  <p style="font-size: 0.65rem">{{ helperText }}</p>
  <div v-if="step === 0">
    <ResetPasswordForm :on-next="resetPasswordOnNext" />
  </div>
  <div v-else-if="step === 1">
    <VerificationCodeForm :on-next="verifcationCodeOnNext" :email="userEmail" />
  </div>
  <div v-else-if="step === 2">
    <ChangePasswordForm :on-submit="changePasswordOnSubmit" :email="userEmail" />
  </div>
  <div v-else></div>
</template>
