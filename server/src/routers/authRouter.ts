import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { config } from '../common/config';
import { createTemplate } from '../common/handlebars';
import { FastifyPluginCallback } from 'fastify';
import { badRequest } from '@hapi/boom';
import Container from 'typedi';
import { UserService } from '../services/userService';

export const authRouter: FastifyPluginCallback = async (fastify) => {
  const userService = Container.get(UserService);

  fastify.post(`/login`, async (req, res) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      throw badRequest(`"username" and "password" must be provided`);
    }

    const token = await userService.login(req, username, password);
    res.cookie(config.JWT_COOKIE, token);
    res.send({ token });
  });
};
