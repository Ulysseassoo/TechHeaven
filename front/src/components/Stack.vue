<script setup lang="ts">
  import { computed } from 'vue';
  type Direction = "row" | "column"

  const props = defineProps<{
    align: string;
    justify: string;
    direction: Direction;
    margin: string;
    gap: string;
    cursor?: string;
    width?: string;
  }>();

  const stackStyle = computed(() => ({
      display: 'flex',
      flexDirection: props.direction,
      justifyContent: props.justify,
      alignItems: props.align,
      marginBlock: props.margin,
      gap: props.gap,
      cursor: props.cursor ?? "initial",
      width: props.width ?? "initial"
    }));

</script>

<template>
    <div :style="stackStyle">
      <slot></slot>
    </div>
</template>