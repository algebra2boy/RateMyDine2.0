import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * This middleware intercepts the incoming request, and validates it.
 * If there is no error, it will forward to the next route handler;
 * otherwise, the middleware will return a series of errors from Zod.
 * @param schema
 */
const ZodMiddleware = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestStructure = { body: req.body, query: req.query, params: req.params };
        schema.parse(requestStructure);

        next();
    } catch (error) {
        return res.status(400).json({
            errors: (error as ZodError).issues.map(x => x.message),
        });
    }
};

export default ZodMiddleware;
