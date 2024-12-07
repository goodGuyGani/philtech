// src/hooks/axiosInstance.ts
import axios from "axios";
import { useUserContext } from "@/hooks/use-user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAxiosInstance = () => {
  const { token, clearUser } = useUserContext();
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
  });

  useEffect(() => {
    axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearUser();
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
  }, [token, navigate, clearUser]);

  return axiosInstance;
};

export default useAxiosInstance;
