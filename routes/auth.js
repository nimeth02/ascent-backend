const express = require("express");
const passport = require("passport"); 
const { checkNotAuthenticated, checkAuthentication } = require("../middlewares/auth");
require('../controllers/auth/strategies');
const {signUpUser} = require('../controllers/auth/auth');
const createResponse = require("../utils/responseHandler");
var router = express.Router();


//sign up 
router.post('/signUp' , signUpUser)

//login 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          // Handle any errors that might occur
          return res.status(500).json(createResponse('error', 500, 'Internal server error', null, err));
      }

      if (!user) {
          // Return specific error messages
          return res.status(401).json(createResponse('fail', 401, info.message));
      }

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json(createResponse('error', 500, 'Session regeneration failed', null, err.message));
        }
  
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            return res.status(500).json(createResponse('error', 500, 'Login error', null, loginErr.message));
          }
  
          return res.status(200).json(createResponse('success', 200, 'Login successful', { user }));
        });
      });
  })(req, res, next);
});
  

//logout 
router.post('/logout', checkAuthentication, async (req, res, next) => {
  try {
    // Check if the user is authenticated before attempting to log out
    if (req.isAuthenticated()) {
      // Logout the user and destroy the session
      req.logout(err => {
        if (err) {
          return next(err); // Passes the error to error-handling middleware
        }

        // Destroy the session completely
        req.session.destroy(err => {
          if (err) {
            return res.status(500).json(createResponse('error', 500, 'Failed to destroy session', null, err.message));
          }
          // Respond with a successful logout message
          res.status(200).json(createResponse('success', 200, 'Logout successful'));
        });
      });
    } else {
      // If the user is not authenticated, there's no need to log out
      res.status(400).json(createResponse('fail', 400, 'No active session to log out from'));
    }
  } catch (err) {
    // Handle unexpected errors
    console.error("Logout error:", err.message);
    res.status(500).json(createResponse('error', 500, 'Logout failed', null, err.message));
  }
});



module.exports = router;