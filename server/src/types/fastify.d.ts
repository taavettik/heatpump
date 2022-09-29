import fastify from 'fastify';
import { ITask } from 'pg-promise';
import { AppUser } from '../../schema';

declare module 'fastify' {
  export interface FastifyRequest {
    tx: ITask<any>;
    user?: AppUser;
  }
}
