// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default(8000),

  // Database
  DATABASE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRE: z.string().default('1h'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),

  // GetStream.io
  STREAM_API_KEY: z.string(),
  STREAM_API_SECRET: z.string(),
  STREAM_APP_ID: z.string(),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // CORS
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Redis (optional)
  REDIS_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
