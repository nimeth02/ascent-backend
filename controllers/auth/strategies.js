const passport = require("passport");
var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { Student } = require("../../config/db.config");
const logger = require("../../utils/logger");




passport.use(new LocalStrategy(
  async function (email, password, cb) {
    try {
      // console.log(email);
      
      const user = await Student.findOne({ where: { email } });
      
      if (!user) return cb(null, false, { message: 'User not found' });

      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) return cb(null, false, { message: 'Incorrect password' });
     
      

      const { password: _, ...userData } = user.dataValues;
      return cb(null, userData);
    } catch (err) {
      logger.error(`User login Error: ${err.message}`);
      return cb(err);
    }
  }
));

passport.serializeUser(function (user, cb) {                //serialize(send user details to create session) user
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {             //de-serialize user (serializeed user)
  process.nextTick(function() {
    return cb(null, user);  
  });  
}); 

