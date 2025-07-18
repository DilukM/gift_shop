export const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let statusCode = 500;
  let message = "Internal server error";
  let details = null;

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
    details = err.details;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === "23505") {
    // PostgreSQL unique constraint violation
    statusCode = 409;
    message = "Resource already exists";
  } else if (err.code === "23503") {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = "Referenced resource does not exist";
  } else if (err.code === "23502") {
    // PostgreSQL not null violation
    statusCode = 400;
    message = "Required field is missing";
  } else if (err.message.includes("not found")) {
    statusCode = 404;
    message = err.message;
  } else if (
    err.message.includes("unauthorized") ||
    err.message.includes("Unauthorized")
  ) {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (
    err.message.includes("forbidden") ||
    err.message.includes("Forbidden")
  ) {
    statusCode = 403;
    message = "Forbidden access";
  } else if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
    message = err.message;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === "production") {
    if (statusCode === 500) {
      message = "Internal server error";
    }
    details = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      timestamp: new Date().toISOString(),
    }),
  });
};
