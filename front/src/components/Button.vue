<script setup lang="ts">
    defineProps<{
        content: string;
    }>()
</script>

<template>
    <VBtn>{{ content }}</VBtn>
</template>