import axios from 'axios';
import { config } from './config';
import { Heatpump, Schedule } from '../shared/schema';
import { CamelCase } from '../shared/types';

const base = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

async function fetchHeatpump() {
  const { data } = await base.get<
    CamelCase<Heatpump> & { schedule?: CamelCase<Schedule> }
  >(`/heatpump/`);

  return data;
}

async function updateHeatpumpState({
  temperature,
  fanSpeed,
  power,
}: {
  temperature?: number;
  fanSpeed?: number;
  power?: boolean;
}) {
  const { data } = await base.patch<CamelCase<Heatpump>>(`/heatpump/state`, {
    temperature,
    fanSpeed,
    power,
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

async function fetchSchedules() {
  const { data } = await base.get<CamelCase<Schedule>[]>('/schedules');

  return data;
}

async function fetchSchedule(id: string) {
  const { data } = await base.get<CamelCase<Schedule>>(`/schedules/${id}`);

  return data;
}

async function updateSchedule({
  id,
  ...body
}: Partial<CamelCase<Schedule>> & { id: string }) {
  const { data } = await base.patch<CamelCase<Schedule>>(
    `/schedules/${id}`,
    body,
  );

  return data;
}

async function me() {
  const { data } = await base.get(`/me`);

  return data;
}

export const api = {
  fetchHeatpump,
  fetchSchedules,
  fetchSchedule,
  updateSchedule,
  updateHeatpumpState,
  login,
  me,
};
