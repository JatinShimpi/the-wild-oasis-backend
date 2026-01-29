import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    } catch (err) {
        if (err.errors) {
            const errorMessage = err.errors.map((e) => e.message).join(", ");
            return next(new ApiError(400, errorMessage));
        }
        next(err);
    }
};
