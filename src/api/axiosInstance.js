
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); // 토큰 인자 제거
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry && 
        !originalRequest.url.includes('/auth/login') && 
        !originalRequest.url.includes('/users/register') &&
        !originalRequest.url.includes('/auth/refresh-token')) {
      
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // 리프레시 토큰 요청
          await axiosInstance.post('/auth/refresh-token'); // 응답에서 토큰 추출 로직 제거

          // 새로운 액세스 토큰이 쿠키로 설정되었으므로, 원래 요청 재시도
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (_error) {
          processQueue(_error);
          window.location.href = '/';
          return Promise.reject(_error);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise(resolve => {
          failedQueue.push(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
