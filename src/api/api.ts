// api/axiosInstance.ts
import axios, { AxiosInstance } from "axios";

let apiInstance: AxiosInstance;

export function getApi(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: (window as any)._env_.API_BASE_URL,
      withCredentials: true, // send cookies
      headers: {
        "Content-Type": "application/json", // default for JSON APIs
      },
    });

    // ✅ Request interceptor: auto-detect FormData
    apiInstance.interceptors.request.use((config) => {
      if (config.data instanceof FormData) {
        // Let browser/axios set multipart boundary
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    });

    // ✅ Response interceptor for token refresh
    apiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try refresh endpoint
            const { data } = await apiInstance.post("/v1/users/refresh");
            if (data.accessToken) {
              // update token globally
              apiInstance.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
            }

            return apiInstance(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
}
