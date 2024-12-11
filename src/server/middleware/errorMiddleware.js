const ErrorHandler = require("../utils/errorHandler");

const errorMiddleware = async (err, req, res, next) => {
  const errorResponse = await ErrorHandler.handleError(err, req.path);
  res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorMiddleware;
