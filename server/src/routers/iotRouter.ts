import { Router } from "express";
import { IotDao } from "../daos/iotDao";

export const iotRouter = Router();

const iotDao = new IotDao();

iotRouter.get('/command', async (req, res) => {
  const command = iotDao.get();

  res.send(command);
});

iotRouter.put('/command', async (req, res) => {
  const command = iotDao.update(req.body);

  res.send(command);
});