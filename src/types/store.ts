export interface IStore {
  put: (params: any) => Promise<any>;
}