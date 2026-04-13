import { OpenAPI } from './api/core/OpenAPI';

export const configureApi = () => {
  OpenAPI.BASE = 'http://127.0.0.1:8000';

  // Request interceptor using OpenAPI configuration
  OpenAPI.TOKEN = async () => {
    return localStorage.getItem('token') || '';
  };
};
