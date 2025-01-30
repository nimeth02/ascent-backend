
const logger = require("../utils/logger");
const createResponse = require("../utils/responseHandler");

// Not Found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);  
};

// Error Handler middleware
const errorHandler = (err, req, res, next) => {
  
  logger.error(`Error occurred: ${err.message}`);
  
  // Check the environment to log the stack trace conditionally
  if (process.env.NODE_ENV !== 'production') {
    logger.error(err.stack);  // Log stack trace only in non-production environments
  }

  // Set the appropriate status code: if not set, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json(createResponse(
    'error', 
    statusCode,
    err.message,
    null,
    process.env.NODE_ENV !== 'production' ? err.stack : null  // Include stack trace in non-production environments
  ));
};
  
module.exports = { notFound, errorHandler };
