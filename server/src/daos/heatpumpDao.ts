import { Service } from 'typedi';
import { Db } from '../common/db';
import { Heatpump, tables } from '../shared/schema';
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
      ${[
        data.name !== undefined ? 'name = $[name],' : '',
        data.temperature !== undefined ? 'temperature = $[temperature]' : '',
        data.fanSpeed !== undefined ? 'fan_speed = $[fanSpeed]' : '',
        data.scheduleId !== undefined ? 'schedule_id = $[scheduleId]' : '',
      ]
        .filter(Boolean)
        .join(',')}
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
