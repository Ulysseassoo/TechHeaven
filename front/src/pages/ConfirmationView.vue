<script setup lang="ts">
import { verifyUser } from "@/api/auth";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const token = route.query.token;
const router = useRouter();

const verifyUserToken = async () => {
  try {
    const result = await verifyUser(token as string);
    if (result.data && result.status === 200) {
      router.push("/login");
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
