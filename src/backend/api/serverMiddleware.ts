import type { Plugin, ViteDevServer } from 'vite';
import { inventoryService } from '../services/inventoryService';
import { checkoutService, CheckoutRequest } from '../services/checkoutService';
import { orderRepository } from '../../database/repositories/orderRepository';
import { dropRepository } from '../../database/repositories/dropRepository';
import { notificationService } from '../services/notificationService';

export function vintageApiServerPlugin(): Plugin {
  return {
    name: 'vintage-vogue-api-engine',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Security Headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        try {
          // 1. GET /api/health
          if (pathname === '/api/health' && req.method === 'GET') {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                status: 'ONLINE',
                engine: 'TypeScript 5.7 + Vite Enterprise Engine',
                currency: 'INR (₹) Strictly',
                hub: 'Sogaria / Workshop Road, Kota, Rajasthan – 324002',
                timestamp: new Date().toISOString(),
                liveUptimeSeconds: Math.round(process.uptime()),
              })
            );
            return;
          }

          // 2. GET /api/products
          if (pathname === '/api/products' && req.method === 'GET') {
            const products = inventoryService.getLiveCatalog();
            res.statusCode = 200;
            res.end(JSON.stringify(products));
            return;
          }

          // 3. GET /api/orders
          if (pathname === '/api/orders' && req.method === 'GET') {
            const orders = orderRepository.getAll();
            res.statusCode = 200;
            res.end(JSON.stringify(orders));
            return;
          }

          // 4. GET /api/drop
          if (pathname === '/api/drop' && req.method === 'GET') {
            const config = dropRepository.getConfig();
            res.statusCode = 200;
            res.end(JSON.stringify(config));
            return;
          }

          // Helper to parse JSON body
          const readJsonBody = async (): Promise<any> => {
            return new Promise((resolve, reject) => {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  resolve(body ? JSON.parse(body) : {});
                } catch (e) {
                  reject(e);
                }
              });
              req.on('error', reject);
            });
          };

          // 5. POST /api/checkout
          if (pathname === '/api/checkout' && req.method === 'POST') {
            const body = await readJsonBody();
            const result = checkoutService.executeCheckout(body as CheckoutRequest);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          // 6. POST /api/drop/verify
          if (pathname === '/api/drop/verify' && req.method === 'POST') {
            const body = await readJsonBody();
            const isValid = dropRepository.verifyPasscode(body.passcode || '');
            res.statusCode = 200;
            res.end(JSON.stringify({ valid: isValid, accessGranted: isValid }));
            return;
          }

          // 7. POST /api/pos/scan
          if (pathname === '/api/pos/scan' && req.method === 'POST') {
            const body = await readJsonBody();
            const query = (body.query || '').trim().toLowerCase();
            const products = inventoryService.getLiveCatalog();
            const found = products.find(
              (p) => p.id.toLowerCase() === query || p.referenceCode.toLowerCase() === query
            );
            if (!found) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: `Specimen ${query} not found in catalog` }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify(found));
            return;
          }

          // 8. GET /api/pos/summary
          if (pathname === '/api/pos/summary' && req.method === 'GET') {
            const orders = orderRepository.getAll();
            let totalPOSRevenue = 0;
            let upiCollected = 0;
            let cashDrawer = 0;
            let posOrderCount = 0;

            for (const o of orders) {
              if (o.channel === 'In-Store POS') {
                posOrderCount++;
                totalPOSRevenue += o.totalAmount;
                if (o.paymentMethod.includes('UPI')) {
                  upiCollected += o.totalAmount;
                } else {
                  cashDrawer += o.totalAmount;
                }
              }
            }

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                shiftStatus: 'ACTIVE',
                counterLocation: 'Kota Studio Register #1',
                posOrderCount,
                totalPOSRevenueINR: totalPOSRevenue,
                upiCollectedINR: upiCollected,
                cashDrawerExpectedINR: cashDrawer,
                currency: 'INR (₹)',
              })
            );
            return;
          }

          // Endpoint not found
          res.statusCode = 404;
          res.end(JSON.stringify({ error: `Endpoint ${pathname} not found.` }));
        } catch (err: any) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message || 'API Execution Error' }));
        }
      });
    },
  };
}
