import { forbidden } from '@hapi/boom';
import { FastifyRequest } from 'fastify';
import { Service } from 'typedi';

@Service()
export class AuthService {
  async authorize(req: FastifyRequest) {
    if (!req.user) {
      throw forbidden();
    }
  }
}
