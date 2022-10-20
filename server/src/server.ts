import 'reflect-metadata';
import './common/handlebars';
import { iotRouter } from './routers/iotRouter';
import './common/db';
import { LegacySchedulingService } from './services/legacySchedulingService';
import { config } from './common/config';
import { heatpumpRouter } from './routers/heatpumpRouter';
import fastify from 'fastify';
import { dbTxPlugin } from './plugins/dbTxPlugin';
import { authPlugin } from './plugins/authPlugin';
import { authRouter } from './routers/authRouter';
import { camelCase } from './common/utils/formatters';
import Container from 'typedi';
import { ScheduleService } from './services/scheduleService';
import { db } from './common/db';
import { scheduleRouter } from './routers/scheduleRouter';

const schedulingService = new LegacySchedulingService();
const scheduleService = Container.get(ScheduleService);

setInterval(async () => {
  await db.tx(async (tx) => {
    await scheduleService.runScheduler(tx);
  });
}, 10000);

db.tx(async (tx) => {
  await scheduleService.runScheduler(tx);
});

const app = fastify({
  logger: true,
});

app.register(dbTxPlugin);
app.register(authPlugin);
app.register(authRouter);
app.register(iotRouter, { prefix: '/iot' });
app.register(heatpumpRouter, { prefix: '/heatpump' });
app.register(scheduleRouter, { prefix: '/schedules' });

async function setupServer() {
  const addr = await app.listen({
    port: config.PORT,
    host: '0.0.0.0',
  });

  console.log(`Server listening on ${addr}`);
}

setupServer();
