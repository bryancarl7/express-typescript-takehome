import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

const BODY_LIMIT_BYTES = 10 * 1024; // 10kb

@Middleware({ type: 'before' })
export class BodySizeLimitMiddleware implements ExpressMiddlewareInterface {

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        const contentLength = parseInt(req.headers['content-length'] || '0', 10);
        if (contentLength > BODY_LIMIT_BYTES) {
            return res.status(413).json({ message: 'Request body too large.' });
        }
        return next();
    }

}
