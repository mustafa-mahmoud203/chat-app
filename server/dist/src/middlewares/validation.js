import { validationResult } from 'express-validator';
// can be reused by many routes
function validationMiddleware(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
    }
    next();
}
export default validationMiddleware;
