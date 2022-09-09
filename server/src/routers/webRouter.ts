import hbs from 'handlebars';
import { Router, default as express } from "express";
import fs from 'fs/promises';
import { IotDao } from '../daos/iotDao';
import { FanSpeed } from '../common/schema';
import { authMiddleware } from '../middleware/authMiddleware';

export const webRouter = Router();

const iotDao = new IotDao();

webRouter.use(express.static('./static'))

webRouter.use(authMiddleware);

webRouter.get('/', async (req, res) => {
  const file = await fs.readFile('./src/templates/index.hbs', 'utf8');
  const command = iotDao.get();

  const template = hbs.compile(file);

  console.log(command);

  res.send(template({
    ...command,
    fanSpeed: command.fanSpeed + 1,
  }));
});

webRouter.post('/temp/increase', async (req, res) => {
  iotDao.update({
    temperature: Math.min(iotDao.get().temperature + 1, 28),
  })
  res.redirect('/');
});

webRouter.post('/temp/decrease', async (req, res) => {
  iotDao.update({
    temperature: Math.max(iotDao.get().temperature - 1, 15),
  })
  res.redirect('/');
});

webRouter.post('/fan/increase', async (req, res) => {
  let newFanSpeed = iotDao.get().fanSpeed + 1;
  if (newFanSpeed > FanSpeed.FAN_SPEED_SILENT) {
    newFanSpeed = 0;
  }

  iotDao.update({
    fanSpeed: newFanSpeed,
  })
  res.redirect('/');
});

webRouter.post('/fan/decrease', async (req, res) => {
  let newFanSpeed = iotDao.get().fanSpeed - 1;
  if (newFanSpeed < 0) {
    newFanSpeed = FanSpeed.FAN_SPEED_SILENT;
  }

  iotDao.update({
    fanSpeed: newFanSpeed,
  })
  res.redirect('/');
});

webRouter.post('/toggle', async (req, res) => {
  iotDao.update({
    on: !iotDao.get().on
  });
  res.redirect('/');
})