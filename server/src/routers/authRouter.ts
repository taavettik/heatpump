import jwt from 'jsonwebtoken';
import { Router } from "express";
import { config } from "../common/config";
import { createTemplate } from '../common/handlebars';

export const authRouter = Router();

authRouter.get('/login', async (req, res) => {
  const template = await createTemplate('login.hbs');

  res.send(template({}));
})

authRouter.post('/login', (req, res) => {
  const { username, password} = req.body;

  console.log(username, password, config.ROOT_PASSWORD)

  if (username === 'root' && password === config.ROOT_PASSWORD) {
    res.cookie(config.JWT_COOKIE, jwt.sign('true', config.JWT_SECRET));
    res.redirect('/');
    return;
  }

  res.redirect('/login?error=true');
});
