// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const uploadField = err.field || null;

  // Supabase auth errors
  if (err.status === 400 && err.message?.includes('already registered')) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds the allowed limit',
      errors: [{
        field: uploadField || 'file',
        message: `The uploaded file for ${uploadField || 'this field'} exceeds the allowed size limit.`
      }]
    });
  }

  if (typeof err.message === 'string' && err.message.startsWith('Invalid file type for')) {
    const matchedField = err.message.match(/Invalid file type for\s([^:]+):/i)?.[1] || uploadField || 'file';
    return res.status(400).json({
      success: false,
      message: 'File type validation failed',
      errors: [{ field: matchedField, message: err.message }]
    });
  }

  // Generic error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};
