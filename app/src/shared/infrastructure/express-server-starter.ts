import { ExpressServer } from '@shared/infrastructure/http/ExpressServer';
import { env } from '@config/env';
import { middlewares } from '@shared-middlewares/index';
import { dataSource } from '@database/data-source';

const server = ExpressServer.getInstance(env('SERVER_PORT'));

server.registerMiddlewares(middlewares);

server.beforeStart(async () => {
  try {
    await dataSource.initialize();
  } catch (error) {
    console.error('[DB] error connecting to database', error);
    process.exit(1);
  }
});

(function startServer(): void {
  server.start(() => {
    console.log(`[SERVER] listening on port ${server.serverPort}`);
  });
})();
