export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret1234',
  JWT_COOKIE: 'ac:token',
  ROOT_PASSWORD: process.env.ROOT_PASSWORD || 'root',
  PORT: Number(process.env.PORT) || 1234,
};
