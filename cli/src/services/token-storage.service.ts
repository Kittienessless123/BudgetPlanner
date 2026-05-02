import { StorageApi } from "../api/storage.api";

export class TokenService {
  private storageApi: StorageApi;
  private token : string | undefined; 
  constructor() {
    this.storageApi = new StorageApi();
  }
  add = async () => {};
  get = async (value : string) => {
    return this.token;
  };
  put = async () => {};
  delete = async () => {};
}
