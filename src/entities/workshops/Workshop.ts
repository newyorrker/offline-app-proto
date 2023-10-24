export interface WorkshopSource {
  title: string;
  organizationId: string;
}

export interface WorkshopDto extends WorkshopSource {
  id: string;
}