<template>
  <div class="data-loading">
    Загрузка...
    <div>
      <p v-if="progress.count">
        Оборудования загруженно: {{ progress.count }}
      </p>
    </div>
    <progress v-if="progress.total" id="file" :value="progress.count" :max="progress.total" />

  </div>
</template>

<script setup lang="ts">

defineProps<{
  progress: { count: number; total: number };
}>();

</script>
<style lang="scss">

</style>