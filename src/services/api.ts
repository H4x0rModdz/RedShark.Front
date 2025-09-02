import { createRequestAuthObj } from "@/lib/auth/auth";
import axios from "axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || 'https://localhost:7080';

// Allow self-signed certificates in development
if (process.env.NODE_ENV === 'development') {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

export const api = axios.create({
  baseURL: baseApiUrl,
  // Additional config for HTTPS in development
  headers: {
    'Content-Type': 'application/json',
    // Remove custom headers to make requests "simple" and avoid preflight
    'Cache-Control': 'no-cache',
  },
  // Enable credentials for cookies/auth
  withCredentials: true,
  // Reduce timeout to fail fast on slow requests
  timeout: 15000, // 15 seconds
});

api.interceptors.request.use(async (config) => {
  const request = await createRequestAuthObj();
  if (request.headers) {
    config.headers.Authorization = request.headers.Authorization;
  }
  return config;
});