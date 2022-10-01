import { Service } from 'typedi';
import { Heatpump, tables } from '../../schema';
import { Db } from '../common/db';
import { CamelCase } from '../shared/types';

@Service()
export class HeatpumpDao {
  private readonly table = tables.heatpump;

  get(db: Db, id: number) {
    return db.one<CamelCase<Heatpump>>(
      `SELECT * FROM heatpump WHERE device_id = $[id]`,
      {
        id,
      },
    );
  }

  update(db: Db, id: string, data: Partial<CamelCase<Heatpump>>) {
    return db.one(
      `
      UPDATE ${this.table.tableName} SET
        ${data.name !== undefined ? 'name = $[name],' : ''}
        temperature = $[temperature],
        fan_speed = $[fanSpeed]
      WHERE id = $[id]
      RETURNING *
    `,
      {
        id,
        ...data,
      },
    );
  }
}
