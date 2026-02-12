"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const consul_1 = __importDefault(require("consul"));
const PORT = 8080;
const app = (0, express_1.default)();
// FIX 1: Port must be a string '8500', not number 8500
const consulClient = (0, consul_1.default)({ host: 'localhost', port: '8500' });
app.use(express_1.default.json());
// Helper to get service URL from Consul
const getServiceUrl = async (serviceName) => {
    try {
        // FIX 2: Cast the result as a Record of strings to ConsulService
        // This tells TypeScript exactly what properties exist on the object
        const services = await consulClient.agent.service.list();
        const serviceEntry = Object.values(services).find((s) => s.Service === serviceName);
        if (!serviceEntry) {
            throw new Error(`Service ${serviceName} not found in Consul`);
        }
        // FIX 3: Now TypeScript knows .Address and .Port exist
        const host = process.env.NODE_ENV === 'docker' ? serviceEntry.Address : 'localhost';
        return `http://${host}:${serviceEntry.Port}`;
    }
    catch (error) {
        console.error('Consul lookup failed:', error);
        throw new Error(`Failed to locate service ${serviceName}`);
    }
};
// Gateway Route for Auth Service
app.use('/api/auth', async (req, res, next) => {
    try {
        const target = await getServiceUrl('auth-service');
        console.log(`Gateway routing to: ${target}`);
        const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
            target,
            changeOrigin: true,
            pathRewrite: { '^/api/auth': '' }, // Remove prefix before forwarding
        });
        proxy(req, res, next);
    }
    catch (error) {
        res.status(503).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
