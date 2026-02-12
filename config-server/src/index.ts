import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());


const configs = {
  'auth-service': {
    db: {
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'secret',
      database: 'auth_db'
    },
    jwt: {
      secret: 'super-secret-jwt-key'
    }
  }
};

app.get('/config/:serviceName', (req: Request, res: Response) => {
  const config = configs[req.params.serviceName as keyof typeof configs];
  if (!config) return res.status(404).json({ error: 'Service config not found' });
  res.json(config);
});

app.listen(PORT, () => {
  console.log(`Config Server running on port ${PORT}`);
});