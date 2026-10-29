import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, '')
  : import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://backent-98m3.onrender.com';

export const api = axios.create({ baseURL });

export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error) && !error.response) {
    return 'No se pudo conectar con el backend (' + baseURL + '). Verifica que esté activo y que VITE_API_URL sea correcto.';
  }
  if (axios.isAxiosError(error) && error.response?.data) {
    return typeof error.response.data === 'string' ? error.response.data : 'El backend devolvió un error.';
  }
  return 'Ocurrió un error inesperado al comunicarse con el backend.';
      }
