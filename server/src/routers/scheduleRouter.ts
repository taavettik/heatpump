import { FastifyPluginCallback } from 'fastify';
import Container from 'typedi';
import { ScheduleService } from '../services/scheduleService';

export const scheduleRouter: FastifyPluginCallback = async (fastify) => {
  const scheduleService = Container.get(ScheduleService);

  fastify.get(`/`, async (req, res) => {
    const schedules = await scheduleService.getAll(req);

    res.send(schedules);
  });

  fastify.get(`/:id`, async (req, res) => {
    const { id } = req.params as { id: string };

    const schedule = await scheduleService.get(req, id);

    res.send(schedule);
  });

  fastify.patch('/:id', async (req, res) => {
    const { id } = req.params as { id: string };

    const schedule = await scheduleService.update(req, id, req.body as any);

    res.send(schedule);
  });
};
