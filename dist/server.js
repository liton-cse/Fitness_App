"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const seedAdmin_1 = require("./DB/seedAdmin");
const logger_1 = require("./shared/logger");
// Handle uncaught exceptions
process.on('uncaughtException', error => {
    logger_1.errorLogger.error('Uncaught Exception Detected', error);
    process.exit(1);
});
let server;
async function main() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(config_1.default.database_url);
        logger_1.logger.info(colors_1.default.green('🚀 Database connected successfully'));
        // Seed Super Admin after DB connection
        await (0, seedAdmin_1.seedSuperAdmin)();
        const port = typeof config_1.default.port === 'number' ? config_1.default.port : Number(config_1.default.port);
        // Start Express server
        server = app_1.default.listen(port, config_1.default.ip_address, () => {
            logger_1.logger.info(colors_1.default.yellow(`♻️  Application listening on port: ${config_1.default.port}`));
        });
    }
    catch (error) {
        logger_1.errorLogger.error(colors_1.default.red('🤢 Failed to connect to Database'), error);
    }
    // Handle unhandled promise rejections
    process.on('unhandledRejection', error => {
        if (server) {
            server.close(() => {
                logger_1.errorLogger.error('Unhandled Rejection Detected', error);
                process.exit(1);
            });
        }
        else {
            process.exit(1);
        }
    });
}
// Run main
main();
// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    if (server) {
        server.close();
    }
});
