import axios from 'axios';
import { config } from './config';
import { Heatpump } from '../shared/schema';
import { CamelCase } from '../shared/types';

const base = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

async function fetchHeatpump() {
  const { data } = await base.get<CamelCase<Heatpump>>(`/heatpump/`);

  return data;
}

async function updateHeatpumpState({
  temperature,
  fanSpeed,
}: {
  temperature?: number;
  fanSpeed?: number;
}) {
  const { data } = await base.patch<CamelCase<Heatpump>>(`/heatpump/state`, {
    temperature,
    fanSpeed,
  });

  return data;
}

async function login(params: { username: string; password: string }) {
  const { data } = await base.post<{ token: string }>(`/login`, {
    username: params.username,
    password: params.password,
  });

  return data;
}

async function me() {
  const { data } = await base.get(`/me`);

  return data;
}

export const api = {
  fetchHeatpump,
  updateHeatpumpState,
  login,
  me,
};
