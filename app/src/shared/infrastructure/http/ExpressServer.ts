import express, { Application, Router, RequestHandler } from 'express';

export class ExpressServer {
  private readonly server: Application;
  private static instance: ExpressServer;
  private initializer?: () => Promise<void>;

  private constructor(private readonly port: number) {
    this.server = express();
  }

  public get serverPort(): number {
    return this.port;
  }

  public static getInstance(port: number): ExpressServer {
    if (!ExpressServer.instance) {
      ExpressServer.instance = new ExpressServer(port);
    }
    return ExpressServer.instance;
  }

  public registerMiddlewares(middlewares: RequestHandler[]): ExpressServer {
    middlewares.forEach(middleware => {
      this.server.use(middleware);
    });
    return this;
  }

  public registerRoutes(routes: Router[]): ExpressServer {
    routes.forEach(route => {
      this.server.use(route);
    });
    return this;
  }

  public start(callback?: () => void): ExpressServer {
    if (this.initializer) {
      this.initializer().then(() => {
        this.server.listen(this.port, callback);
      });
    } else {
      this.server.listen(this.port, callback);
    }

    return this;
  }

  public beforeStart(initializer: () => Promise<void>): ExpressServer {
    this.initializer = initializer;
    return this;
  }
}
