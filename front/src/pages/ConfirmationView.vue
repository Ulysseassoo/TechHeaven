<script setup lang="ts">
import { verifyUser } from "@/api/auth";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const route = useRoute();
const token = route.query.token;
const router = useRouter();

const verifyUserToken = async () => {
  try {
    const result = await verifyUser(token as string);
    if (result.status === 200) {
      await router.push("/login");
      toast.success("Your account has been verified. Please log in now.");
    }
  } catch (error) {
    router.push("/");
  }
};

onMounted(async () => {
  await verifyUserToken();
});
</script>

<template>
  <div></div>
</template>
