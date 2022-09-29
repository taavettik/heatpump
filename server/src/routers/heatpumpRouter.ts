import { badRequest } from '@hapi/boom';
import { Router } from 'express';
import fastify, { FastifyPluginCallback } from 'fastify';
import Container from 'typedi';
import { HeatpumpService } from '../services/heatpumpService';

export const heatpumpRouter: FastifyPluginCallback = async (fastify) => {
  const heatpumpService = Container.get(HeatpumpService);

  fastify.get('/:id', async (req, res) => {
    const id = (req.params as any).id;

    const heatpump = await heatpumpService.get(req, id);

    res.send(heatpump);
  });
};
