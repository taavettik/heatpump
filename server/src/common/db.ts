import JSONdb from 'simple-json-db';
import createPgp, { ITask } from 'pg-promise';
import { config } from './config';

export const jsonDb = new JSONdb<any>(`${__dirname}/store.json`);

const pgp = createPgp();

export const db = pgp({
  user: config.DB_USER,
  database: config.DB_DATABASE,
  password: config.DB_PASSWORD,
});

export type Db = ITask<any> | typeof db;
