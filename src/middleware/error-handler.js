/* eslint-disable import/extensions */
import logger from "./logger.js";

function errorHandlerMiddleware(err, req, res, next) {
  logger.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV === "development") {
    return next(err);
  }

  return res
    .status(500)
    .json({ error: err.message || "Internal Server Error" });
}

export default errorHandlerMiddleware;
