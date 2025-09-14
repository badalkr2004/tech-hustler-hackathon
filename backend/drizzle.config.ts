import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import config from './src/config/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
