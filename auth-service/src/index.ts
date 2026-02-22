import express, { Express } from 'express';
import mongoose from 'mongoose';
import consul from 'consul';
import axios from 'axios';

import { createAuthRoutes } from './routes/authRoutes';
import cors from 'cors';

const SERVICE_NAME = 'auth-service';
const SERVICE_PORT = 3001;
const PROFILE = process.env.PROFILE || 'dev';

async function bootstrap() {
  const app: Express = express();
  app.use(express.json());
  app.use(cors());

  console.log(`[${SERVICE_NAME}] Fetching configuration (profile: ${PROFILE})...`);

  let config: any;
  try {
    const configUrl = `http://localhost:8888/${SERVICE_NAME}/${PROFILE}`;
    const response = await axios.get(configUrl);
    config = response.data;
  } catch (err) {
    console.error('Failed to fetch config. Is config-server running?');
    process.exit(1);
  }
  console.log(config.db.username, config.db.password, config.db.host, config.db.database);
  const mongoUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:27017/${config.db.database}?authSource=admin`;
  await mongoose.connect(mongoUri);
  console.log(`[${SERVICE_NAME}] Database connected.`);

  app.use('/', createAuthRoutes(config.jwt.secret));

  const consulClient = new consul({ host: 'localhost', port: '8500' });
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

  app.listen(SERVICE_PORT, '0.0.0.0', () => {
    console.log(`[${SERVICE_NAME}] Running on port ${SERVICE_PORT}`);
  });
}

bootstrap();