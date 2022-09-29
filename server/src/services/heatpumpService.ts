import { notFound } from '@hapi/boom';
import { FastifyRequest } from 'fastify';
import Container, { Service } from 'typedi';
import { HeatpumpDao } from '../daos/heatpumpDao';

@Service()
export class HeatpumpService {
  constructor(
    private readonly heatpumpDao: HeatpumpDao = Container.get(HeatpumpDao),
  ) {}

  async get(req: FastifyRequest, id: number) {
    const hp = await this.heatpumpDao.get(req.tx, id);

    return hp;
  }
}
