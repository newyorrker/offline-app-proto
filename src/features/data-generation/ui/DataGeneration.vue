<template>
  <div class="data-generation">
    <p v-if="dataExists">
      Данные сгенерированны...
    </p>

    <button v-else @click="generate">Generate data</button>

    <!-- переписать данные... -->


    <!-- проверка наличия данных -->
    <!-- если нет то доступна кнопка сгенерировать данные -->
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { DataGenerationService } from '../services/DataGenerationService';
import { ObjectRepository } from "../../../shared/api";


const dataExists = ref(false);
const objectRepository = new ObjectRepository();

const dataGenerationService = new DataGenerationService(objectRepository);


onMounted(async () => {
  dataExists.value = await dataGenerationService.check();
});

const generate = () => {
  dataGenerationService.generate();
}

</script>
<style lang="scss">
  .data-generation {
    border: 1px grey solid;
    padding: 16px;
  }
</style>