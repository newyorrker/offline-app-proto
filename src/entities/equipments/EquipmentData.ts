export interface EquipmentSource {
  title: string;
  inventoryNumber: string;
  nfcTagCode: string;
  workshopId: string;
}

export interface EquipmentDto extends EquipmentSource {
  id: string;
}