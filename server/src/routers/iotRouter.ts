import { Router } from 'express';
import { FastifyPluginAsync } from 'fastify';
import { IotDao } from '../daos/iotDao';

const iotDao = new IotDao();

export const iotRouter: FastifyPluginAsync = async (fastify) => {
  fastify.get('/command', async (req, res) => {
    const command = iotDao.get();

    res.send(command);
  });
};
