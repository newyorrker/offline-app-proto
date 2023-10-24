import Api, { AxiosInstance } from "../Api";
import type {AxiosRequestConfig} from "axios";

export class ObjectRepository {
  protected client: AxiosInstance;



  constructor() {
    this.client = Api.getInstance().getClient();
  }

  async getObjects<T>(
    query: Record<string, any>,
    schema: string,
    config: AxiosRequestConfig = {},
  ): Promise<Array<T>> {
    const res = await this.client.post<T[]>(`/objects/${schema}/query`, query, config);
    return res.data;
  }

  async getCount(
    schema: string,
    query: Record<string, any> = {take: 0}
  ) {
    return await this.client.post(`/objects/${schema}/query`, query, {params: { count: true}}).then(({headers, data}) => {

      return parseInt(headers['x-appercode-totalitems'] || 0)
    });
  }

  findObject<T>(schema: string, objectId: string) {
    return this.client.get<T>(`/objects/${schema}/${objectId}`)
        .then((obj) => obj.data);
  }

  createBatch(data: any[], schema: string) {
    return this.client.post(`/objects/${schema}/batch`, data);
  }
}