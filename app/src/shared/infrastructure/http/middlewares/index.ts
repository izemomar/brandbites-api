import { corsMiddleware } from '@sharedMiddlewares/cors.middleware';
import {
  jsonMiddleware,
  urlencodedMiddleware
} from '@sharedMiddlewares/body-parser.middleware';
import { helmetMiddleware } from '@sharedMiddlewares/helmet.middleware';
import morgan from 'morgan';
import compression from 'compression';

export default [
  corsMiddleware,
  jsonMiddleware,
  urlencodedMiddleware,
  helmetMiddleware,
  morgan('combined'),
  compression()
];
