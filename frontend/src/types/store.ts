export type StoreStatus = "Provisioning" | "Ready" | "Failed"

export interface Store {
  id: string
  status: StoreStatus
  namespace: string
  createdAt: string
  url?: string
}

export interface CreateStoreResponse extends Store {}
