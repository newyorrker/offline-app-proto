import { OrganizationDto } from "@src/entities/organizations";
import { AppData } from "../model/AppData";
import { WorkshopDto } from "@src/entities/workshops";
import { EquipmentDto } from "@src/entities/equipments";

const DB_NAME = "app-data";
const DB_VERSION_1 = 1;

const ORGANIZATIONS_STORE_NAME = "Organizations";
const WORKSHOPS_STOE_NAME = "Workshops";
const EQUIPMENTS_STORE_NAME = "Equipments";

const storeNames = [
  ORGANIZATIONS_STORE_NAME,
  WORKSHOPS_STOE_NAME,
  EQUIPMENTS_STORE_NAME
];

export class DatabaseService {
  storeIsEmpty() {
    const request = indexedDB.open(DB_NAME, DB_VERSION_1);

    return new Promise((resolve, reject) => {

      request.onupgradeneeded = () => {
        const db = request.result;

        for (const tableName of storeNames) {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName, { keyPath: 'id' });
          }
        }
      }

      request.onsuccess = async () => {
        const db = request.result;

        const transaction = db.transaction(storeNames, "readonly");

        let storeIsEmpty = false;

        for (const storeName of storeNames) {
          const objectStore = transaction.objectStore(storeName);
          const countRequest = objectStore.count();
          const countPromise = new Promise((resolve) => {
            countRequest.onsuccess = () => {
              resolve(countRequest.result);
            }
          });

          const res = await countPromise;

          if(!res) {
            storeIsEmpty = true;
            break;
          }
        }

        resolve(storeIsEmpty);
      }

      request.onerror = (event) => {
        reject(event);
      }
    });
  }

  addData(data: AppData) {

    const request = indexedDB.open(DB_NAME, DB_VERSION_1);

    request.onsuccess = () => {

      const db = request.result;

      const transaction = db.transaction(storeNames, "readwrite");

      const organizationsStore = transaction.objectStore(ORGANIZATIONS_STORE_NAME);
      const workshopsStore = transaction.objectStore(WORKSHOPS_STOE_NAME);
      const equipmentsStore = transaction.objectStore(EQUIPMENTS_STORE_NAME);

      data.organizations?.forEach((organization) => {
        organizationsStore.add(organization);
      });

      data.workshops?.forEach((workshop) => {
        workshopsStore.add(workshop);
      });

      data.equipments?.forEach((equipment) => {
        equipmentsStore.add(equipment);
      });

      transaction.onerror = () => {
        console.log("error on transaction");
      }

      db.onerror = () => {
        console.log("error on db");
      }

      db.close();
    }
  }

  getData(): Promise<AppData> {
    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION_1);


      request.onsuccess = async () => {
        const db = request.result;

        const transaction = db.transaction(storeNames, "readonly");

        const organizationsStore = transaction.objectStore(ORGANIZATIONS_STORE_NAME);
        const workshopsStore = transaction.objectStore(WORKSHOPS_STOE_NAME);
        const equipmentsStore = transaction.objectStore(EQUIPMENTS_STORE_NAME);

        const organizationsRequest = organizationsStore.getAll() as IDBRequest<OrganizationDto[]>;
        const workshopsRequest = workshopsStore.getAll() as IDBRequest<WorkshopDto[]>;
        const equipmentsRequest = equipmentsStore.getAll() as IDBRequest<EquipmentDto[]>;

        const promises: [Promise<OrganizationDto[]>, Promise<WorkshopDto[]>, Promise<EquipmentDto[]>] = [
          new Promise((resolve) => {
            organizationsRequest.onsuccess = () => {
              resolve(organizationsRequest.result);
            }
          }),
          new Promise((resolve) => {
            workshopsRequest.onsuccess = () => {
              resolve(workshopsRequest.result);
            }
          }),
          new Promise((resolve) => {
            equipmentsRequest.onsuccess = () => {
              resolve(equipmentsRequest.result);
            }
          })
        ]

        const [organizations, workshops, equipments] = await Promise.all(promises);

        resolve({ organizations, workshops, equipments });
      }
    });
  }

  deleteDb() {
    indexedDB.deleteDatabase(DB_NAME);
  }
}