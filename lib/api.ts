import axios from 'axios';

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8080'}/`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await api.post('/auth/refresh', null, { withCredentials: true });
          isRefreshing = false;
          processQueue();
          return api(originalRequest);
        } catch (err) {
          processQueue(err);
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject: (err: unknown) => reject(err),
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
