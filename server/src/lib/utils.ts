/**
 * Utility function to bypass middleware for a specific path
 * @param path
 * @param middleware
 * @returns
 */

export const unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.originalUrl) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}
