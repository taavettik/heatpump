import { Router } from 'express';

export const heatpumpRouter = Router();

heatpumpRouter.get('/:id', async (req, res) => {
  res.send((req as any).tx || '');
});
