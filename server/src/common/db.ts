import JSONdb from 'simple-json-db';
import createPgp, { ITask } from 'pg-promise';
import { config } from './config';
import { camelCase } from './utils/formatters';

export const jsonDb = new JSONdb<any>(`${__dirname}/store.json`);

const pgp = createPgp({
  receive: (data) => {
    // we have to directly mutate the object :)
    for (let i = 0; i < data.length; i++) {
      data[i] = camelCase(data[i]);
    }
  },
});

export const db = pgp({
  user: config.DB_USER,
  database: config.DB_DATABASE,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
});

export type Db = ITask<any> | typeof db;
