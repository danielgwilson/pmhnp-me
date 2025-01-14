import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

// Export environment configuration
export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY,
  },
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
};
