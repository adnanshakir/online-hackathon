import app from './src/app.js';
import connectDB from './src/config/db.js';
import { config } from './src/config/config.js';
import { logger } from './src/utils/logger.js';

const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
