import { Service } from 'typedi';
import { AppUser } from '../../schema';
import { Db } from '../common/db';
import { CamelCase } from '../common/utils/types';

@Service()
export class UserDao {
  get(db: Db, id: string) {
    return db.oneOrNone<CamelCase<AppUser>>(
      `SELECT * FROM app_user WHERE id = $[id]`,
      {
        id,
      },
    );
  }

  getByUsername(db: Db, username: string) {
    return db.oneOrNone<CamelCase<AppUser>>(
      `SELECT * FROM app_user WHERE username = $[username]`,
      {
        username,
      },
    );
  }
}
