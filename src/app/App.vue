<template>
  <div class="logos">
    <a v-html="ViteICon" href="https://vitejs.dev" target="_blank">
    </a>
    <a v-html="VueIcon" href="https://vuejs.org/" target="_blank">
    </a>
  </div>

  <br>

  <Controller />





</template>

<script setup lang="ts">

import VueIcon from '../assets/vue.svg';
import ViteICon from "../assets/vite.svg";
import { Controller } from '@src/features/app-controller';

/**
 * 1. Проверка наличия данных
 */







</script>

<style lang="scss">

.logos {
  a {
    padding: 8px;
  }
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
