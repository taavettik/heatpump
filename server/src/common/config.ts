import secrets from '../../secrets.json';

export const config = {
  JWT_SECRET: secrets.JWT_SECRET,
  JWT_COOKIE: 'ac:token',
  ROOT_PASSWORD: secrets.ROOT_PASSWORD,
  PORT: Number(process.env.PORT) || 1234,
};
