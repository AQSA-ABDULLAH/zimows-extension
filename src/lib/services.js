import axios from "axios";
import axiosRetry from "axios-retry";
import {
  DEFAULT_HEADERS,
  LAMDA_API_BASE,
  LAMDA_API_BASE_2,
  LAMDA_API_BASE_3,
  LAMDA_API_BASE_4,
} from "./constants";

export const request_lamda4 = axios.create({
  baseURL: LAMDA_API_BASE_4,
  headers: DEFAULT_HEADERS,
  timeout: 15000, // 15s
});

axiosRetry(request_lamda4, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Wait 1 second before retrying
  },
  retryCondition: (error) => {
    return (
      error.response.status === 502 || // Retry on 502 Bad Gateway
      error.response.status === 503 || // Retry on 503 Service Unavailable
      error.response.status === 504 // Retry on 504 Gateway Timeout
    );
  },
});

export const request_lamda1 = axios.create({
  baseURL: LAMDA_API_BASE,
  headers: DEFAULT_HEADERS,
  timeout: 15000, // 15s
});

axiosRetry(request_lamda1, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Wait 1 second before retrying
  },
  retryCondition: (error) => {
    return (
      error.response.status === 502 || // Retry on 502 Bad Gateway
      error.response.status === 503 || // Retry on 503 Service Unavailable
      error.response.status === 504 // Retry on 504 Gateway Timeout
    );
  },
});

export const request_lamda2 = axios.create({
  baseURL: LAMDA_API_BASE_2,
  headers: DEFAULT_HEADERS,
  timeout: 15000, // 15s
});

axiosRetry(request_lamda2, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Wait 1 second before retrying
  },
  retryCondition: (error) => {
    return (
      error.response.status === 502 || // Retry on 502 Bad Gateway
      error.response.status === 503 || // Retry on 503 Service Unavailable
      error.response.status === 504 // Retry on 504 Gateway Timeout
    );
  },
});

export const request_lamda3 = axios.create({
  baseURL: LAMDA_API_BASE_3,
  headers: DEFAULT_HEADERS,
  timeout: 15000, // 15s
});

axiosRetry(request_lamda3, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Wait 1 second before retrying
  },
  retryCondition: (error) => {
    return (
      error.response.status === 502 || // Retry on 502 Bad Gateway
      error.response.status === 503 || // Retry on 503 Service Unavailable
      error.response.status === 504 // Retry on 504 Gateway Timeout
    );
  },
});

