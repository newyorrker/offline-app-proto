<template>
  <div class="data-display">

    <div class="select-content">
      <p>
        <label for="">
          <span>Организация</span>
          <br>
          <select v-model="selectedOrganizationId" name="organizations" id="organizations">
            <option v-for="organization in data.value.organizations" :value="organization.id">{{ organization.title }}</option>
          </select>
        </label>

      </p>
      <p>
        <label>
          <span>Цех</span>
          <br>
          <select v-model="selectedWorkshopId" name="workshops" id="workshops">
            <option v-for="workshop in filteredWorkshops" :value="workshop.id">{{ workshop.title }}</option>
          </select>
        </label>
      </p>
    </div>

    <!-- <pre>{{ data.value.equipments }}</pre> -->


    <div class="table-content">
      <div class="table-content-container">
        <table>
          <thead>
            <th>Название</th>
            <th>Инвентарный номер</th>
            <th>Код NFC-метки</th>
          </thead>
          <tbody>
            <tr v-for="equipment in filteredEquipments">
              <td>{{ equipment.title.slice(0, Math.ceil(Math.random()*35)) }}</td>
              <td>{{ equipment.inventoryNumber.slice(0, Math.ceil(Math.random()*40)) }}</td>
              <td>{{ equipment.nfcTagCode.slice(0, Math.ceil(Math.random()*15)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { AppData } from '@src/features/app-controller';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  data: { value: AppData };
}>();

const selectedOrganizationId = ref<string | null>(null);
const selectedWorkshopId = ref<string | null>(null);

const filteredWorkshops = computed(() => {
  return props.data.value.workshops?.filter((workshop) => workshop.organizationId === selectedOrganizationId.value)
});

const filteredEquipments = computed(() => {
  return props.data.value.equipments?.filter((equipment) => equipment.workshopId === selectedWorkshopId.value)
});

onMounted(() => {
  selectedOrganizationId.value = props.data.value.organizations?.[0]?.id || null;
  selectedWorkshopId.value = filteredWorkshops.value?.[0]?.id || null;
});

watch(selectedOrganizationId, () => {
  selectedWorkshopId.value = filteredWorkshops.value?.[0]?.id || null;
});

</script>
<style lang="scss">
  .data-display {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    width: 100%;
    height: calc(100% - 70px);
  }
  .select-content {
    display: flex;
    text-align: left;

    select {
      min-width: 150px;
      font-size: 14px;
    }

    p + p {
      margin-left: 32px;
    }
  }

  .table-content-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .table-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr);
    width: 100%;
    height: 100%;
    text-align: left;

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    thead {
      position: sticky;
      top: 0;
      background-color: white;
    }

    th, td {
      padding: 8px;
    }

    th {
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-right: 1px solid;

    }

    td {
      border-bottom: 1px solid;
      border-right: 1px solid;
    }

    th:first-child,
    td:first-child {
      /* Apply a left border on the first <td> or <th> in a row */
      border-left: 1px solid;
    }

    th, th:first-child {
      border-color: rgb(197, 197, 197);
    }

    td, td:first-child {
      border-color: rgb(218, 218, 218);
    }
  }
</style>