import express, { Application, Router, RequestHandler } from 'express';

export default class App {
  private readonly app: Application;
  private static instance: App;
  private initializer?: () => Promise<void>;

  private constructor(private readonly port: number) {
    this.app = express();
  }

  public get appPort(): number {
    return this.port;
  }

  public static getInstance(port: number): App {
    if (!App.instance) {
      App.instance = new App(port);
    }
    return App.instance;
  }

  public registerMiddlewares(middlewares: RequestHandler[]): App {
    middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
    return this;
  }

  public registerRoutes(routes: Router[]): App {
    routes.forEach(route => {
      this.app.use(route);
    });
    return this;
  }

  public start(callback?: () => void): App {
    if (this.initializer) {
      this.initializer().then(() => {
        this.app.listen(this.port, callback);
      });
    } else {
      this.app.listen(this.port, callback);
    }

    return this;
  }

  public beforeStart(initializer: () => Promise<void>): App {
    this.initializer = initializer;
    return this;
  }
}
