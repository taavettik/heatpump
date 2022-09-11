import express from 'express';
import cookieParser from 'cookie-parser';
import './common/handlebars';
import { iotRouter } from './routers/iotRouter';
import './common/db';
import { json, urlencoded } from 'body-parser';
import { webRouter } from './routers/webRouter';
import { SchedulingService } from './services/schedulingService';
import { authMiddleware } from './middleware/authMiddleware';
import { authRouter } from './routers/authRouter';
import { config } from './common/config';

const schedulingService = new SchedulingService();

setInterval(() => {
  schedulingService.run();
}, 60000);

schedulingService.run();

const app = express();

app.use(cookieParser());
app.use(json());
app.use(urlencoded());

app.use('/iot', iotRouter);

app.use('/', authRouter);

app.use('/', webRouter);

app.listen(config.PORT, () => console.log(`Listening on ${config.PORT}...`));
