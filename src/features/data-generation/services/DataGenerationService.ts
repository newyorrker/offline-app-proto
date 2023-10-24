import { ObjectRepository } from "../../../shared/api";
import { splitList } from "../../../shared/lib";
import { GeneratedData } from "./GeneratedData";
import { ORGANIZATIONS_SCHEMA } from "@src/entities/organizations";
import { WORKSHOPS_SCHEMA, WorkshopDto } from "@src/entities/workshops";
import { EQUIPMENTS_SCHEMA } from "@src/entities/equipments";


function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}



const collections: string[] = [
  ORGANIZATIONS_SCHEMA,
  WORKSHOPS_SCHEMA,
  EQUIPMENTS_SCHEMA
]

export class DataGenerationService {

  generatedData = new GeneratedData();

  constructor(private objectRepository: ObjectRepository) {}

  async check(): Promise<boolean> {

    /**
     * 1. Проверить сразу кол-во по каждой коллекции
     * 2. Вернуть true если хотя-бы в одной коллекции есть данные есть
     */

    let result = false;

    for (const collection of collections) {

      if(!result) {
        result = !!await this.objectRepository.getCount(collection);
      }
      else {
        break;
      }
    }

    return result;
  }

  async generate() {

    try {
      const organizations = await this.createOrganizations();

      const workshops = await this.createWorkshops(organizations);
      const equipment = this.createEquipments(workshops);






    }
    catch(e) {
      console.error(e);
    }

    /**
     * 1. Сегенрить компании
     * 2. Сгенерить цеха
     * 3. Сгенерить компании
     */

  }

  async createOrganizations() {
    try {

      const data = this.generatedData.getOrganizations();

      const response = await this.objectRepository.createBatch(data, ORGANIZATIONS_SCHEMA)

      return response.data.map((organization: any) => ({id: organization.id, title: organization.title}));
    }
    catch(e) {
      console.error(e);
    }
  }

  async createWorkshops(organizations: any) {

    const data = this.generatedData.getWorkshops(organizations);

    if(!data.length) {
      return [];
    }

    const response = await this.objectRepository.createBatch(data, WORKSHOPS_SCHEMA)

    return response.data || [];
  }

  async createEquipments(workshops: WorkshopDto[]) {

    let progress = 0;

    const newList = splitList(workshops, 1);

    //разбить на порции по 20 цехов
    for (const workshopBatch of newList) {


      const data = this.generatedData.getEquipments(workshopBatch);

      const dataList = splitList(data, 900);


      for (const dataItem of dataList) {
        progress+= JSON.stringify(dataItem).length;
        this.conutProgress(progress);
        try {
          await this.objectRepository.createBatch(dataItem, EQUIPMENTS_SCHEMA);
        }
        catch(e) {
          console.error(e);
          await sleep(5000);
        }

      }
    }
  }

  conutProgress(bits: number) {
    console.log(`${(bits/8)/1024/1024} Mb loaded`);
  }
}