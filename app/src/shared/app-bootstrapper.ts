import App from '@shared/infrastructure/http/App';
import { env } from '@config/env';
import middlewares from '@sharedMiddlewares/index';

const app = App.getInstance(env('SERVER_PORT'));

app.registerMiddlewares(middlewares);

app.beforeStart(async () => {
  console.log('[App] initializing...');
});

export default app;
