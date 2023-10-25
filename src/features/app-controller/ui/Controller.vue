<template>
  <DataGeneration @generated="start" />
  <DataLoading v-if="isLoadingData" :progress="loadingProgress" />
  <DataDisplay v-if="!isLoadingData" @clear="clearData" :data="loadedData" />
</template>

<script setup lang="ts">

import { DataLoadService, DataLoading } from "@src/features/data-loading";
import { DatabaseService } from "../services/DatabaseService";
import { DataGeneration } from '@src/features/data-generation';
import { DataDisplay } from "@src/features/data-display";
import { onMounted, reactive, ref } from "vue";
import { ObjectRepository } from "@src/shared/api";
import { AppData } from "..";

const isLoadingData = ref(true);
const loadingProgress = reactive({ text: "", count: 0, total: 0 });
const loadedData = reactive<{value: AppData}>({value: {}});

const dbService = new DatabaseService();

const clearData = () => {
  dbService.deleteDb();
  window.location.reload();
}

const start = async () => {
  const storeIsEmpty = await dbService.storeIsEmpty();

  isLoadingData.value = true;

  if(storeIsEmpty) {
    const objectRepository = new ObjectRepository();
    const dataLoadService = new DataLoadService(objectRepository);

    try {
      dataLoadService.subscribe(loadingProgress);

      const data = await dataLoadService.load();

      loadedData.value = data;

      isLoadingData.value = false;

      console.log("add data");

      dbService.addData(data);

    }
    catch(e) {
      dbService.deleteDb();
    }
  }
  else {

    //загрузка данных из базы
    const data = await dbService.getData();

    console.log(data);
    loadedData.value = data;
  }

  isLoadingData.value = false;
}

onMounted(async () => {

  start();

})

</script>
<style lang="scss">

</style>