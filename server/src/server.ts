import 'reflect-metadata';
import './common/handlebars';
import { iotRouter } from './routers/iotRouter';
import './common/db';
import { SchedulingService } from './services/schedulingService';
import { config } from './common/config';
import { heatpumpRouter } from './routers/heatpumpRouter';
import fastify from 'fastify';
import { dbTxPlugin } from './plugins/dbTxPlugin';
import { authPlugin } from './plugins/authPlugin';
import { authRouter } from './routers/authRouter';
import { camelCase } from './common/utils/formatters';

const schedulingService = new SchedulingService();

setInterval(() => {
  schedulingService.run();
}, 60000);

schedulingService.run();

const app = fastify({
  logger: true,
});

app.register(dbTxPlugin);
app.register(authPlugin);
app.register(authRouter);
app.register(iotRouter, { prefix: '/iot' });
app.register(heatpumpRouter, { prefix: '/heatpump' });

async function setupServer() {
  const addr = await app.listen({
    port: config.PORT,
    host: '0.0.0.0',
  });

  console.log(`Server listening on ${addr}`);
}

setupServer();
