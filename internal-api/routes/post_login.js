const _ = require('lodash');
const auth = require('../lib/auth');
const dao = require('../lib/dao');
const jwt = require('../lib/jwt');

module.exports = async (event) => {
  let user;
  try {
    // Verify the Google Oauth token and extract the user details.
    user = await auth(event.queryStringParameters.token);
  }
  catch (e) {
    console.error(e);
    return {
      statusCode: 403,
      body: {
        ok: false,
        error: 'Invalid Google Auth Token.'
      }
    };
  }

  // Save user in DB.
  await dao.put(user);

  // Create our JWT token to use with this session.
  const token = await jwt.sign(user);

  return {
    statusCode: 200,
    body: {
      ok: true,
      user: _.merge({}, user, {token})
    }
  };
};
