import type { Request, Response } from 'express';

function runCallbackMiddlewareAsPromise(
  req: Request,
  res: Response,
  fn: Function
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export { runCallbackMiddlewareAsPromise };
