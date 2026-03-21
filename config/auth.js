'use strict';

require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
