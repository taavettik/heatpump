import fastify from 'fastify';
import { IConnected, ITask } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { AppUser } from '../../schema';

declare module 'fastify' {
  export interface FastifyRequest {
    tx: ITask<any>;
    cn: IConnected<{}, IClient>;
    user?: AppUser;
  }
}
