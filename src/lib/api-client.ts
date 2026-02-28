import { AxiosRequestConfig, AxiosResponse } from "axios";
import api from "./axios";

type ApiResponse<T> = { data: T };

// fix @danieldare2025
// function extractData<T>(response: unknown): T {
//   // Todo: @danieldare2025 fix bad typing
//   return typeof (response as any)?.data?.data === undefined
//     ? (response as any)?.data?.data
//     : (response as any)?.data;
// }

function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const inner = response.data;
  return (inner && "data" in inner ? inner.data : inner) as T;
}

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await api.get<ApiResponse<T>>(url, config);
    return extractData<T>(res);
  },

  post: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await api.post<ApiResponse<T>>(url, body, config);
    return extractData<T>(res);
  },

  put: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await api.put<ApiResponse<T>>(url, body, config);
    return extractData<T>(res);
  },

  patch: async <T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const res = await api.patch<ApiResponse<T>>(url, body, config);
    return extractData<T>(res);
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await api.delete<ApiResponse<T>>(url, config);
    return extractData<T>(res);
  },
};
