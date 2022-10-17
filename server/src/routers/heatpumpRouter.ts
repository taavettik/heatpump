import { badRequest } from '@hapi/boom';
import { Router } from 'express';
import fastify, { FastifyPluginCallback } from 'fastify';
import Container from 'typedi';
import { HeatpumpService } from '../services/heatpumpService';
import { ScheduleService } from '../services/scheduleService';

export const heatpumpRouter: FastifyPluginCallback = async (fastify) => {
  const heatpumpService = Container.get(HeatpumpService);
  const scheduleService = Container.get(ScheduleService);

  fastify.get('/', async (req, res) => {
    const heatpump = await heatpumpService.get(req, 1);

    const [currentSchedule] = heatpump.scheduleId
      ? await scheduleService.get(req, heatpump.scheduleId)
      : [];

    res.send({ ...heatpump, schedule: currentSchedule });
  });

  fastify.patch('/state', {
    handler: async (req, res) => {
      const hp = await heatpumpService.get(req, 1);

      const { temperature, fanSpeed, power } = req.body as {
        temperature: number;
        fanSpeed: number;
        power: boolean;
      };

      const updated = await heatpumpService.updateState(req, hp.id, {
        temperature,
        fanSpeed,
        power,
      });

      res.send(updated);
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          temperature: { type: 'number' },
          fanSpeed: { type: 'number' },
          power: { type: 'boolean' },
        },
      },
    },
  });
};
