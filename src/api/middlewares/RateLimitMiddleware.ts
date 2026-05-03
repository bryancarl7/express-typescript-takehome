import * as express from 'express';
import rateLimit from 'express-rate-limit';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';

const limiter = rateLimit({
    windowMs: env.security.rateLimitWindowMs,
    max: env.security.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});

@Middleware({ type: 'before' })
export class RateLimitMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return limiter(req, res, next);
    }

}
