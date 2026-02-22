import express, { Express, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import consul from "consul";
import cors from "cors";

const PORT = 8080;
const SERVICE_NAME = "gateway";

const app: Express = express();
app.use(cors());

const consulClient = new consul({
  host: "localhost",
  port: "8500",
});

interface ConsulService {
  Service: string;
  Address: string;
  Port: number;
  ID: string;
  Tags?: string[];
}

const registerService = async () => {
  try {
    await consulClient.agent.service.register({
      name: SERVICE_NAME,
      id: `${SERVICE_NAME}-${PORT}`,
      address: "172.22.64.1",
      port: PORT,
      check: {
        http: `http://172.22.64.1:${PORT}/health`,
        interval: "10s",
      },
    });

    console.log("Gateway registered in Consul");
  } catch (err) {
    console.error("Failed to register gateway:", err);
  }
};



app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

const getServiceUrl = async (serviceName: string): Promise<string> => {
  const services = (await consulClient.agent.service.list()) as Record<
    string,
    ConsulService
  >;

  const serviceEntry = Object.values(services).find(
    (s) => s.Service === serviceName
  );

  if (!serviceEntry) {
    throw new Error(`Service ${serviceName} not found in Consul`);
  }


  const host = serviceEntry.Address || "localhost";

  return `http://${host}:${serviceEntry.Port}`;
};

app.use("/api/auth", async (req, res, next) => {
  try {
    const target = await getServiceUrl("auth-service");

    console.log(`➡️  Gateway routing /api/auth -> ${target}`);

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        "^/api/auth": "",
      },
      logLevel: "debug",
    })(req, res, next);
  } catch (error: any) {
    console.error("Proxy error:", error.message);
    return res.status(503).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`API Gateway running on port ${PORT}`);
  await registerService(); 
});
