import { FastifyRequest } from 'fastify';
import Container, { Service } from 'typedi';
import { Db } from '../common/db';
import { HeatpumpDao } from '../daos/heatpumpDao';
import { ScheduleDao } from '../daos/scheduleDao';
import { Schedule } from '../shared/schema';
import { CamelCase, CreateSchedulePayload } from '../shared/types';
import { AuthService } from './authService';

@Service()
export class ScheduleService {
  constructor(
    private readonly authService = Container.get(AuthService),
    private readonly scheduleDao = Container.get(ScheduleDao),
    private readonly heatpumpDao = Container.get(HeatpumpDao),
  ) {}

  async get(req: FastifyRequest, id: string) {
    await this.authService.authorize(req);

    const schedule = await this.scheduleDao.get(req.tx, id);

    if (!schedule) {
      return null;
    }

    return this.format(schedule);
  }

  async getAll(req: FastifyRequest) {
    await this.authService.authorize(req);

    const schedules = await this.scheduleDao.getAll(req.tx);

    return schedules.map((s) => this.format(s));
  }

  async update(
    req: FastifyRequest,
    id: string,
    data: Partial<CamelCase<Schedule>>,
  ) {
    await this.authService.authorize(req);

    const updated = await this.scheduleDao.update(req.tx, id, data);

    return this.format(updated);
  }

  async delete(req: FastifyRequest, id: string) {
    await this.authService.authorize(req);

    return this.scheduleDao.delete(req.tx, id);
  }

  async create(req: FastifyRequest, data: CreateSchedulePayload) {
    await this.authService.authorize(req);

    const schedule = await this.scheduleDao.create(req.tx, data);

    return this.format(schedule);
  }

  async applySchedule(
    tx: Db,
    heatpumpId: string,
    schedule: CamelCase<Schedule>,
  ) {
    this.log(
      `Applying schedule ${schedule.id}: ${schedule.temperature} C, fan speed ${schedule.fanSpeed}`,
    );

    await this.heatpumpDao.update(tx, heatpumpId, {
      temperature: schedule.temperature,
      fanSpeed: schedule.fanSpeed,
      scheduleId: schedule.id,
    });
  }

  async runScheduler(tx: Db) {
    this.log(`Running...`);

    const [currentSchedule] = await this.scheduleDao.getCurrent(tx);
    const defaultSchedule = await this.scheduleDao.getDefault(tx);

    console.log('Current schedule', currentSchedule);

    const heatpump = await this.heatpumpDao.get(tx, 1);

    if (!currentSchedule) {
      if (defaultSchedule && heatpump.scheduleId !== defaultSchedule.id) {
        await this.applySchedule(tx, heatpump.id, defaultSchedule);
      }

      return;
    }

    if (heatpump.scheduleId !== currentSchedule.id) {
      await this.applySchedule(tx, heatpump.id, currentSchedule);
    }
  }

  private log(...params: any[]) {
    console.log(`[${new Date().toISOString()}] [Scheduler]`, ...params);
  }

  private format(schedule: CamelCase<Schedule>) {
    return {
      ...schedule,
      weekdays:
        (schedule as any).weekdays?.match(/{(.*?)}/)?.[1].split(',') ?? null,
    };
  }
}
