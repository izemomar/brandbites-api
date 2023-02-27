import App from '@shared/infrastructure/http/App';
import { env } from '@config/env';
import { middlewares } from '@shared-middlewares/index';
import { dataSource } from '@database/data-source';

const app = App.getInstance(env('SERVER_PORT'));

app.registerMiddlewares(middlewares);

app.beforeStart(async () => {
  try {
    await dataSource.initialize();
  } catch (error) {
    console.error('[DB] error connecting to database', error);
    process.exit(1);
  }
});

export function startApp(callback?: () => void): void {
  app.start(callback);
}
