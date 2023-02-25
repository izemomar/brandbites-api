import cors from 'cors';
import { envOr, defaultEnv } from '@config/env';

const allowedOrigins = envOr('ALLOWED_ORIGINS', defaultEnv('ALLOWED_ORIGINS'));

export const corsMiddleware = cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization, lang'
});
