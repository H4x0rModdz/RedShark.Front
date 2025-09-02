import { createRequestAuthObj } from "@/lib/auth/auth";
import axios from "axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7156';

// Allow self-signed certificates in development
if (process.env.NODE_ENV === 'development') {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

export const api = axios.create({
  baseURL: baseApiUrl,
  // Additional config for HTTPS in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const request = await createRequestAuthObj();
  if (request.headers) {
    config.headers.Authorization = request.headers.Authorization;
  }
  return config;
});