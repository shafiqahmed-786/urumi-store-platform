import axios from "axios";

const API = axios.create({
  baseURL: "" // important
});

export const fetchStores = () => API.get("/stores");
export const createStore = () => API.post("/stores");
export const deleteStore = (id) => API.delete(`/stores/${id}`);
