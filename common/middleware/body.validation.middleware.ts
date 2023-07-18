import express from 'express';
import { validationResult } from 'express-validator';

class BodyValidationMiddleware {
  validateRequest(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(400).send({ errors: errors.array() });
    }
  }
}

export default new BodyValidationMiddleware();
