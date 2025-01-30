const createResponse = require("../utils/responseHandler");


exports.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("Authenticated user:", req.user); // Log the authenticated user for debugging
    return next(); // User is authenticated, proceed to the next middleware
  } else {
    // User is not authenticated
    console.log("Unauthenticated request for:", req.originalUrl);
      // For AJAX requests, send a JSON response instead of redirecting
      return res.status(401).json(createResponse('fail', 401, "Unauthorized, please log in."));
    
  }
}
