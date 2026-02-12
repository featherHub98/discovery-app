import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import consul from 'consul';
import cors from 'cors';

const PORT = 8080;
const app: Express = express();


const consulClient = new consul({ host: 'localhost', port: '8500' });
app.use(cors());



interface ConsulService {
  Service: string;
  Address: string;
  Port: number;
  ID: string;
  Tags?: string[];
}


const getServiceUrl = async (serviceName: string): Promise<string> => {
  try {
 
    const services = await consulClient.agent.service.list() as Record<string, ConsulService>;

    const serviceEntry = Object.values(services).find((s: ConsulService) => s.Service === serviceName);
    
    if (!serviceEntry) {
      throw new Error(`Service ${serviceName} not found in Consul`);
    }
    

    const host = process.env.NODE_ENV === 'docker' ? serviceEntry.Address : 'localhost';
    return `http://${host}:${serviceEntry.Port}`;
  } catch (error) {
    console.error('Consul lookup failed:', error);
    throw new Error(`Failed to locate service ${serviceName}`);
  }
};


app.use('/api/auth', async (req, res, next) => {
  try {
    const target = await getServiceUrl('auth-service');
    console.log(`Gateway routing to: ${target}`);
    
    const proxy = createProxyMiddleware({ 
      target, 
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '' }, 
    });
    
    proxy(req, res, next);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});