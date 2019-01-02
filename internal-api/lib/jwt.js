var jwt = require('jsonwebtoken');

module.exports = {
  sign: (user) => {
    return new Promise(function(resolve, reject) {
      jwt.sign(user, process.env.JwtSecret, {expiresIn: '1 day'}, function(err, token) {
          if (err !== null) reject(err);
          else resolve(token);
      });
    });
  },
  verify: (token) => {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, process.env.JwtSecret, function(err, user) {
          if (err !== null) reject(err);
          else resolve(user);
      });
    });
  }
}