import { FastifyPluginCallback } from 'fastify';
import Container from 'typedi';
import { ScheduleService } from '../services/scheduleService';

export const scheduleRouter: FastifyPluginCallback = async (fastify) => {
  const scheduleService = Container.get(ScheduleService);

  fastify.get(`/`, async (req, res) => {
    const schedules = await scheduleService.getAll(req);

    res.send(schedules);
  });
};
