// Centralized sanitized error handler
const errorHandler = (err, req, res, next) => {
  // Privacy Rule: Never log sensitive document or message contents
  console.error(`[Error] ${err.name || 'InternalError'}: ${err.message || 'Unknown error'}`);

  // Multer specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size limit exceeded. Maximum file size allowed is 10 MB.',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded at once. Maximum 10 files per batch.',
    });
  }

  // Handle Mongoose CastError / Duplicate key
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID format.',
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'A record with this unique value already exists.',
    });
  }

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred. Please try again.',
    // Never leak stack trace or sensitive info in production
    ...(process.env.NODE_ENV === 'development' ? { errorType: err.name } : {}),
  });
};

module.exports = errorHandler;
