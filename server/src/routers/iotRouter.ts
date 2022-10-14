import { Router } from 'express';
import { FastifyPluginAsync } from 'fastify';
import Container from 'typedi';
import { HeatpumpDao } from '../daos/heatpumpDao';
import { IotDao } from '../daos/iotDao';

const iotDao = new IotDao();
const heatpumpDao = Container.get(HeatpumpDao);

export const iotRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get('/command', async (req, res) => {
    const heatpump = await heatpumpDao.get(req.tx, 1);

    res.send({
      on: true,
      mode: heatpump.mode === 'heat' ? 0 : 1,
      temperature: heatpump.temperature,
      fanSpeed: heatpump.fanSpeed,
    });
  });
};
