import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { showToast } from "@/components/toast";
import { useAuthStore } from "@/store/authStore";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

type StatusCode = 401 | 403 | 404 | 500;

/**
 * =========================
 * TOKEN MANAGEMENT
 * =========================
 */
const extractErrorMessage = (error: AxiosError): string => {
  const data = error.response?.data as {
    message?: string;
    error?: string;
    detail?: string;
  };
  return (
    data?.detail ||
    data?.message ||
    data?.error ||
    error.message ||
    "Network Error, kindly try again!"
  );
};

const getCachedToken = async (): Promise<string | null> => {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    // ✅ correct way to access zustand store outside components
    const token = useAuthStore.getState().token;

    if (token) {
      cachedToken = token;
      tokenExpiry = now + TOKEN_CACHE_DURATION;
      return token;
    }

    cachedToken = null;
    tokenExpiry = 0;
    return null;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

/**
 * =========================
 * ERROR HANDLING
 * =========================
 */
const STATUS_MESSAGES: Record<StatusCode, string> = {
  401: "Your session has expired or is invalid. Please log in again!!!",
  403: "You do not have permission.",
  404: "Resource not found.",
  500: "Server error. Try again later.",
};

const handleErrorToast = ({
  status,
  rawMessage,
  showToast: showToastProp,
}: {
  status: StatusCode;
  rawMessage?: string;
  showToast: boolean;
}): void => {
  if (!showToastProp) return;
  const defaultMessage = STATUS_MESSAGES[status];
  const message = rawMessage || defaultMessage;
  showToast({ variant: "error", message });
};

export const handleAppError = ({
  showToast = false,
  error,
}: {
  showToast?: boolean;
  error: unknown;
}) => {
  let status: StatusCode = 500;
  let message = "An unknown error occurred. afoo";

  if ((error as AxiosError)?.response) {
    status = (error as AxiosError).response!.status as StatusCode;
    message = extractErrorMessage(error as AxiosError);
  } else {
    message = (error as Error).message || "An unknown error occurred.";
  }

  handleErrorToast({
    status,
    rawMessage: message,
    showToast,
  });
};

/**
 * =========================
 * AXIOS INSTANCE
 * =========================
 */
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const token = await getCachedToken();

      if (token && config.headers) {
        // ✅ Use correct header format (check backend: usually "Bearer")
        config.headers.Authorization = `Token ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error: AxiosError) => {
      const status = (error.response?.status as StatusCode) || 500;
      const message = extractErrorMessage(error);
      return Promise.reject({
        status,
        message,
        originalError: error,
      });
    }
  );
};

const createInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create(config);
  setupInterceptors(instance);
  return instance;
};

const api = createInstance({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const createInternalClient = () =>
  createInstance({
    baseURL:
      typeof window === "undefined" || !window.location?.origin
        ? "/"
        : window.location.origin,
  });

export default api;
