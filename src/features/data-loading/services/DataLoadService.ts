import { ObjectRepository } from "@src/shared/api";

import { ORGANIZATIONS_SCHEMA, OrganizationDto } from "@src/entities/organizations";
import { WORKSHOPS_SCHEMA, WorkshopDto } from "@src/entities/workshops";
import { EQUIPMENTS_SCHEMA, EquipmentDto } from "@src/entities/equipments";

interface Progress {
  text: string;
  count: number;
  total: number;
}

export class DataLoadService {
  constructor(private objectRepository: ObjectRepository) {
  }

  async load() {

    const [organizations, workshops, equipments] = await Promise.all([
      this.loadOrganizations(),
      this.loadWorkshops(),
      this.loadEquipments()
    ]);

    return {
      organizations: organizations,
      workshops: workshops,
      equipments: equipments,
    }
  }

  private loadOrganizations() {
    return this.objectRepository.getObjects<OrganizationDto>({take: -1, include: ["id", "title"]}, ORGANIZATIONS_SCHEMA);
  }

  private loadWorkshops() {
    return this.objectRepository.getObjects<WorkshopDto>({take: -1, include: ["id", "title", "organizationId"]}, WORKSHOPS_SCHEMA);
  }

  private async loadEquipments() {

    const include = [
      "id",
      "title",
      "inventoryNumber",
      "nfcTagCode",
      "workshopId",
    ]

    const result: EquipmentDto[] = [];

    // take: 25, skip: 0
    // take: 35, skip: 25
    // take: 20, skip: 60
    // take: 100, skip: 80

    //создать список промисов

    let total = 0;

    const count = await this.objectRepository.getCount(EQUIPMENTS_SCHEMA, { take: 0 });

    this.subscriptions.forEach((data) => {
      // data.text = workshop.title;
      data.count = total;
      data.total = count;
    });

    let skip = 0;
    const batch = Math.ceil(count / 10);

    for (let i = 0; i < batch; i++) {

      const targetTake = 27;

      const take = targetTake;

      const promises: Promise<EquipmentDto[]>[] = [];

      for (let i = 0; i < 121; i++) {

        if(skip >= count) {
          break;
        }

        const promise = this.objectRepository.getObjects<EquipmentDto>({skip, take, include}, EQUIPMENTS_SCHEMA, { timeout: 120000 })
          .then((data) => {

            total+=data.length;

            this.subscriptions.forEach((data) => {
              // data.text = workshop.title;
              data.count = total;
            });

            return data;
          });

        promises.push(promise);

        skip+=take;
      }

      const responsesList = (await Promise.all(promises)).flat();

      result.push.apply(result, responsesList);

      if(skip >= count) {
        break;
      }
    }

    return result
  }

  subscriptions: Progress[] = [];

  subscribe(data: Progress) {
    this.subscriptions.push(data);
  }
}