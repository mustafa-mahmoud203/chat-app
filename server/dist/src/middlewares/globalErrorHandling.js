class ErrorHandling {
    static globalErrorHandling(err, req, res, next) {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        if (err) {
            return res.status(statusCode).json({
                status: "error",
                statusCode,
                message,
                stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
            });
        }
    }
}
export default ErrorHandling.globalErrorHandling;
