import { Router } from 'express';
import { createAuthController } from '../controllers/AuthController';
import { createAuthService } from '../services/AuthService';
import { createAuthRepository } from '../repositories/AuthRepository';

export const createAuthRoutes = (userModel: any, jwtSecret: string) => {
  const router = Router();


  const repo = createAuthRepository(userModel);
  const service = createAuthService(repo, jwtSecret);
  const controller = createAuthController(service);

  router.post('/register', controller.register);
  router.post('/login', controller.login);

  router.get('/health', (req, res) => res.send('OK'));

  return router;
};