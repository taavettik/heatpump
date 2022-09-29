export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret1234',
  JWT_COOKIE: 'ac:token',
  ROOT_PASSWORD: process.env.ROOT_PASSWORD || 'root',
  PORT: Number(process.env.PORT) || 1234,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string, // could/should use volume-mounted secrets..
  DB_DATABASE: process.env.DB_DATABASE as string,
};
