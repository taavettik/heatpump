import { Service } from 'typedi';
import { Db } from '../common/db';
import { AppUser } from '../shared/schema';
import { CamelCase } from '../shared/types';

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
