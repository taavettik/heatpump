import JSONdb from "simple-json-db";

export const db = new JSONdb<any>(`${__dirname}/store.json`);
