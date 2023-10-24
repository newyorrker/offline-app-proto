import { EquipmentSource } from "../../../entities/equipments";
import { WorkshopDto } from "../../../entities/workshops";
import { generateRandomString } from "../../../shared/lib";

interface WorkshopSource {
  title: string;
  organizationId: string;
}

export class GeneratedData {
  getOrganizations() {
    return [
      "TechGrowth",
      "EcoSolutions",
      "BioTech",
      "SolarPower",
      "AquaFresh",
      "FoodHub",
      "GreenTech",
      "BioWorld",
      "CloudWare",
      "EnergyPulse"
    ].map((organization) => ({ title: organization }));
  }

  getWorkshops(organizations: any) {
    if(!organizations?.length) {
      return [];
    }

    const workShopsSourceList = [];

    for (const organization of organizations) {
      const organizationsName = organization.title;

      for (let i = 0; i < 10; i++) {
        const number = i+1 < 10 ? "0"+(i+1) : i+1;
        const title = `${organizationsName}-WorkShop-${number}`;

        const item: WorkshopSource = {
          title,
          organizationId: organization.id
        }

        workShopsSourceList.push(item);
      }
    }

    return workShopsSourceList;
  }

  getEquipments(workshops: WorkshopDto[]) {
    const generateInventoryNumber = (index: number) => {
      return `${generateRandomString(1000)}-${index}`
    }

    const generateNfcTagCode = () => {
      return `${generateRandomString(10)}`
    }

    const generateTitlePayload = () => {
      return `${generateRandomString(900)}`
    }


    const equipmentsSource = [];

    for (const workshop of workshops) {
      for (let i = 0; i < 1000; i++) {

        const inventoryNumber = generateInventoryNumber(i);
        const nfcTagCode = generateNfcTagCode();
        const title = `Equipment-${generateTitlePayload()}-${i}`;
        const workshopId = workshop.id;


        //shoud 16000bit long

        const equipmentSource: EquipmentSource = {
          inventoryNumber,
          nfcTagCode,
          title,
          workshopId
        }

        equipmentsSource.push(equipmentSource);
      }
    }

    return equipmentsSource;
  }
}