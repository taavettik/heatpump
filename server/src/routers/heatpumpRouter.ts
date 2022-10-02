import { badRequest } from '@hapi/boom';
import { Router } from 'express';
import fastify, { FastifyPluginCallback } from 'fastify';
import Container from 'typedi';
import { HeatpumpService } from '../services/heatpumpService';

export const heatpumpRouter: FastifyPluginCallback = async (fastify) => {
  const heatpumpService = Container.get(HeatpumpService);

  fastify.get('/', async (req, res) => {
    const heatpump = await heatpumpService.get(req, 1);

    res.send(heatpump);
  });

  fastify.patch('/state', {
    handler: async (req, res) => {
      const hp = await heatpumpService.get(req, 1);

      const { temperature, fanSpeed } = req.body as {
        temperature: number;
        fanSpeed: number;
      };

      const updated = await heatpumpService.updateState(req, hp.id, {
        temperature,
        fanSpeed,
      });

      res.send(updated);
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          temperature: { type: 'number' },
          fanSpeed: { type: 'number' },
        },
      },
    },
  });
};
