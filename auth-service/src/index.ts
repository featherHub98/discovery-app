import express, { Express } from 'express';
import { Sequelize } from 'sequelize';
import consul from 'consul';
import axios from 'axios';
import { defineUser } from './models/User';
import { createAuthRoutes } from './routes/authRoutes';
import cors from 'cors';

const   SERVICE_NAME = 'auth-service';
const SERVICE_PORT = 3001;

async function bootstrap() {
  const app: Express = express();
  app.use(express.json());
  app.use(cors());

  console.log(`[${SERVICE_NAME}] Fetching configuration...`);
  let config: any;
  try {

    const response = await axios.get(`http://localhost:8888/config/${SERVICE_NAME}`);
    config = response.data;
  } catch (err) {
    console.error('Failed to fetch config. Is config-server running?');
    process.exit(1);
  }

  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      dialect: 'postgres',
      logging: false,
    }
  );

  const UserModel = defineUser(sequelize);

  await sequelize.sync({ alter: true });
  console.log(`[${SERVICE_NAME}] Database connected & synced.`);

  app.use('/', createAuthRoutes(UserModel, config.jwt.secret));

  const consulClient =new consul({ host: 'localhost', port: '8500' });
  
  await consulClient.agent.service.register({
    name: SERVICE_NAME,
    address: '172.22.64.1', 
    port: SERVICE_PORT,
    check: {
      http: `http://172.22.64.1:${SERVICE_PORT}/health`,
      interval: '10s',
    },
  });
  console.log(`[${SERVICE_NAME}] Registered with Consul.`);


  app.listen(SERVICE_PORT, '0.0.0.0',() => {
    console.log(`[${SERVICE_NAME}] Running on port ${SERVICE_PORT}`);
  });
}

bootstrap();