import fastifyCookie from '@fastify/cookie';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { config } from '../common/config';

const plugin: FastifyPluginCallback = async (fastify) => {
  fastify.register(fastifyCookie);

  fastify.addHook('preHandler', async (req, res) => {
    const cookie = req.cookies?.[config.JWT_COOKIE];

    if (!cookie) {
      return;
    }

    try {
      const user = jwt.verify(cookie, config.JWT_SECRET);

      req.user = user as any;
    } catch {
      return;
    }
  });
};

export const authPlugin = fp(plugin, { name: 'authPlugin' });
