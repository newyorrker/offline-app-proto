/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORGANIZATIONS_SCHEMA: string;
  readonly VITE_WORKSHOPS_SCHEMA: string;
  readonly VITE_EQUIPMENTS_SCHEMA: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}