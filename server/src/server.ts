import express from 'express';
import './common/handlebars';
import { iotRouter } from './routers/iotRouter';
import './common/db';
import { json, urlencoded } from 'body-parser';
import { webRouter } from './routers/webRouter';
import { SchedulingService } from './services/schedulingService';

const schedulingService = new SchedulingService();

setInterval(() => {
  schedulingService.run();
}, 60000)

schedulingService.run();

const app = express();

app.use(json());
app.use(urlencoded());

app.use('/', webRouter);
app.use('/iot', iotRouter);

app.listen(3123, () => console.log('Listening..'));