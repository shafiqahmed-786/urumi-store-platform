import axios from "axios"
import type { Store, CreateStoreResponse } from "../types/store"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const storeApi = {
  async getStores(): Promise<Store[]> {
    const res = await api.get("/stores")
    return res.data
  },

  async createStore(): Promise<CreateStoreResponse> {
    const res = await api.post("/stores")
    return res.data
  },

  async deleteStore(id: string): Promise<void> {
    await api.delete(`/stores/${id}`)
  },
}
