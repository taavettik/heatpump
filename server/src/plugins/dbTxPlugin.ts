import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { ITask } from 'pg-promise';
import { db } from '../common/db';

const plugin: FastifyPluginCallback = async (fastify) => {
  let transactions: Promise<void>[] = [];

  fastify.addHook('preHandler', async (req, res) => {
    const cn = await db.connect();

    req.cn = cn;

    await cn.tx((tx) => (req.tx = tx));
  });

  fastify.addHook('onResponse', async (req, res) => {
    await req.cn.done();
  });
};

export const dbTxPlugin = fp(plugin, { name: 'dbTxPlugin' });
