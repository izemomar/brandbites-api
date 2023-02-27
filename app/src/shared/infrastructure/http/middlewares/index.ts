import morgan from 'morgan';
import compression from 'compression';

import { corsMiddleware } from '@shared-middlewares/cors.middleware';
import {
  jsonMiddleware,
  urlencodedMiddleware
} from '@shared-middlewares/body-parser.middleware';
import { helmetMiddleware } from '@shared-middlewares/helmet.middleware';

export const middlewares = [
  corsMiddleware,
  jsonMiddleware,
  urlencodedMiddleware,
  helmetMiddleware,
  morgan('combined'),
  compression()
];
