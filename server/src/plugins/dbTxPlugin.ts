import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { db } from '../common/db';

const plugin: FastifyPluginCallback = async (fastify) => {
  fastify.addHook('preHandler', async (req, res) => {
    const cn = await db.connect();

    await cn.tx((tx) => (req.tx = tx));
  });
};

export const dbTxPlugin = fp(plugin, { name: 'dbTxPlugin' });
