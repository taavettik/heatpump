import { Service } from 'typedi';
import { Heatpump } from '../../schema';
import { Db } from '../common/db';
import { CamelCase } from '../common/utils/types';

@Service()
export class HeatpumpDao {
  get(db: Db) {
    return db.one<CamelCase<Heatpump>>(`SELECT * FROM heatpump`);
  }
}
