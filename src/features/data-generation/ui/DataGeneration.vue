<template>
  <div class="data-generation">
    <p v-if="dataExists && dataExists !== null">
      Данные сгенерированны
    </p>
    <p v-else-if="dataExists === null">
      Проверка данных...
    </p>
    <p v-else-if="inProgress">
      Генерация данных...
    </p>

    <button v-else @click="generate">Сгенерировать данные</button>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { DataGenerationService } from '../services/DataGenerationService';
import { ObjectRepository } from "../../../shared/api";
import { sleep } from '@src/shared/lib/common';

const emit = defineEmits(['generated']);

const dataExists = ref<boolean | null>(null);
const inProgress = ref(false);
const objectRepository = new ObjectRepository();

const dataGenerationService = new DataGenerationService(objectRepository);


onMounted(async () => {
  await sleep(500);
  dataExists.value = await dataGenerationService.check();
});

const generate = async () => {
  try {
    inProgress.value = true;
    await dataGenerationService.generate();
    emit("generated");
    dataExists.value = await dataGenerationService.check();
  }
  catch(e) {
    console.error(e);
  }
  finally {
    inProgress.value = false;
  }
}

</script>
<style lang="scss">
  .data-generation {
    border: 1px rgb(222, 222, 222) solid;
    border-radius: 8px;
    padding: 8px 16px;
    margin-bottom: 32px;
  }
</style>