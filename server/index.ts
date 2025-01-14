import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes';
import { config } from './config/env';
import chalk from 'chalk';
import { setupVite, serveStatic } from './vite';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(chalk.dim(logLine));
    }
  });

  next();
});

// Register routes
const server = registerRoutes(app);

// Startup logging
const log = console.log;
log('\n🚀', chalk.bold('Starting server...'));
log('📍', chalk.dim('Environment:'), chalk.cyan(config.env));
log(
  '🔑',
  chalk.dim('OpenAI API:'),
  config.openai.apiKey ? chalk.green('Configured') : chalk.red('Missing')
);
log('🌐', chalk.dim('Port:'), chalk.yellow(config.port));

// Setup Vite or static serving
(async () => {
  if (config.env === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  server.listen(config.port, () => {
    log(
      '✨',
      chalk.green.bold(`Server ready at http://localhost:${config.port}`)
    );
  });
})();
