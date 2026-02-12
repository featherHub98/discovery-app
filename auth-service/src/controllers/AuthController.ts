import { Request, Response } from 'express';

type AuthService = {
  register: (u: string, e: string, p: string) => Promise<any>;
  login: (u: string, p: string) => Promise<any>;
};

export const createAuthController = (authService: AuthService) => {
  
  const register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await authService.register(username, email, password);
      res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  const login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  return {
    register,
    login,
  };
};