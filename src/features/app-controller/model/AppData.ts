import { EquipmentDto } from "@src/entities/equipments";
import { OrganizationDto } from "@src/entities/organizations";
import { WorkshopDto } from "@src/entities/workshops";

export interface AppData {
  organizations?: OrganizationDto[];
  workshops?: WorkshopDto[];
  equipments?: EquipmentDto[];
}