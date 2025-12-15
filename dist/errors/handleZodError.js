"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map(el => {
        const lastPath = el.path[el.path.length - 1];
        const safePath = typeof lastPath === 'symbol' ? String(lastPath) : lastPath;
        return {
            path: safePath,
            message: el.message,
        };
    });
    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMessages,
    };
};
exports.default = handleZodError;
