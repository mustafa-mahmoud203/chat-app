"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationMiddleware = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
        }
        next();
    };
};
exports.default = validationMiddleware;
//# sourceMappingURL=validation.js.map