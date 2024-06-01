<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const token = route.query.token;
const router = useRouter();

const verifyUserToken = async () => {
  try {
    const result = await axios.post("http://localhost:8000/api/verify", {
      token,
    });
    if (result.data && result.data.status === 200) {
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
