import { BodySizeLimitMiddleware } from '../../../src/api/middlewares/BodySizeLimitMiddleware';

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (contentLength?: string) => ({
    headers: { 'content-length': contentLength },
} as any);

describe('BodySizeLimitMiddleware', () => {

    let middleware: BodySizeLimitMiddleware;
    let next: jest.Mock;

    beforeEach(() => {
        middleware = new BodySizeLimitMiddleware();
        next = jest.fn();
    });

    test('calls next() when content-length is within limit', () => {
        const req = mockReq('1024');
        const res = mockRes();
        middleware.use(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test('calls next() when content-length header is absent', () => {
        const req = mockReq(undefined);
        const res = mockRes();
        middleware.use(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('returns 413 when content-length exceeds 10kb', () => {
        const req = mockReq('20480');
        const res = mockRes();
        middleware.use(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(413);
        expect(res.json).toHaveBeenCalledWith({ message: 'Request body too large.' });
    });

    test('returns 413 when content-length is exactly one byte over limit', () => {
        const req = mockReq(String(10 * 1024 + 1));
        const res = mockRes();
        middleware.use(req, res, next);
        expect(res.status).toHaveBeenCalledWith(413);
    });

    test('calls next() when content-length is exactly at the limit', () => {
        const req = mockReq(String(10 * 1024));
        const res = mockRes();
        middleware.use(req, res, next);
        expect(next).toHaveBeenCalled();
    });

});
