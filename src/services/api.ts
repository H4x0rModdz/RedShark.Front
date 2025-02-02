import { createRequestAuthObj } from "@/lib/auth/auth";
import axios from "axios";

const baseApiUrl = process.env.NEXT_PUBLIC_URL;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export const api = axios.create({
  baseURL: baseApiUrl,
});

api.interceptors.request.use(async (config) => {
  const request = await createRequestAuthObj();
  if (request.headers) {
    config.headers.Authorization = request.headers.Authorization;
  }
  return config;
});