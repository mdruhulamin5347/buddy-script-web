import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Access Token

let accessToken: string |null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Request Interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= axiosInstance
          .post("/auth/refresh")
          .then((res) => {
            const token = res.data.data.accessToken as string;

            setAccessToken(token);

            refreshPromise = null;

            return token;
          });

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        refreshPromise = null;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);