import { notFound } from '@hapi/boom';
import { FastifyRequest } from 'fastify';
import Container, { Service } from 'typedi';
import { HeatpumpDao } from '../daos/heatpumpDao';
import { AuthService } from './authService';

@Service()
export class HeatpumpService {
  constructor(
    private readonly authService: AuthService,
    private readonly heatpumpDao: HeatpumpDao = Container.get(HeatpumpDao),
  ) {}

  async get(req: FastifyRequest, id: number) {
    await this.authService.authorize(req);

    const hp = await this.heatpumpDao.get(req.tx, id);

    return hp;
  }

  async updateState(
    req: FastifyRequest,
    id: string,
    state: { temperature: number; fanSpeed: number; power: boolean },
  ) {
    await this.authService.authorize(req);

    return this.heatpumpDao.update(req.tx, id, state);
  }
}
