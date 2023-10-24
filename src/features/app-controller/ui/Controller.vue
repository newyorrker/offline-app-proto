<template>
  <DataLoading v-if="isLoadingData" :progress="loadingProgress" />
  <DataDisplay v-if="!isLoadingData" :data="loadedData" />
</template>

<script setup lang="ts">

import { DataLoadService, DataLoading } from "@src/features/data-loading";
import { DatabaseService } from "../services/DatabaseService";
import { DataDisplay } from "@src/features/data-display";
import { onMounted, reactive, ref } from "vue";
import { ObjectRepository } from "@src/shared/api";
import { AppData } from "..";


const isLoadingData = ref(true);
const loadingProgress = reactive({ text: "", count: 0, total: 0 });
const loadedData = reactive<{value: AppData}>({value: {}});

onMounted(async () => {

  const dbService = new DatabaseService();
  const dbExist = ref(await dbService.hasTables());

  isLoadingData.value = true;

  console.log(dbExist.value);

  if(!dbExist.value) {
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
})

</script>
<style lang="scss">

</style>