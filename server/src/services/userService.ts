import { forbidden } from '@hapi/boom';
import { compare } from '@node-rs/bcrypt';
import { FastifyRequest } from 'fastify';
import Container, { Service } from 'typedi';
import { UserDao } from '../daos/userDao';
import jwt from 'jsonwebtoken';
import { config } from '../common/config';

@Service()
export class UserService {
  constructor(private readonly userDao = Container.get(UserDao)) {}

  async login(req: FastifyRequest, username: string, password: string) {
    const user = await this.userDao.getByUsername(req.tx, username);

    if (!user) {
      throw forbidden();
    }

    const passwordCorrect = await compare(password, user.passwordHash);

    if (!passwordCorrect) {
      throw forbidden();
    }

    return jwt.sign(user, config.JWT_SECRET);
  }
}
