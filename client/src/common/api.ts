import axios from 'axios';
import { config } from './config';
import { Heatpump } from '../shared/schema';

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

export async function fetchHeatpump() {
  const { data } = await api.get<Heatpump>(`/heatpump/`);

  return data;
}
