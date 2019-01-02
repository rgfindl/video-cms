const _ = require('lodash');
const jwt = require('./lib/jwt');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event, null, 3));
  if (_.isEqual(event.httpMethod, 'OPTIONS')) {
    return callback(null, {
      statusCode: 200,
      headers: HEADERS
    });
  }
  const routeModulePath = `./routes/${_.toLower(event.httpMethod)}_${_.replace(_.trim(event.path, '/'), /\//g, '-')}`;
  let token;
  try {
    if (_.startsWith(event.path, '/private')) {
      try {
        console.log('auth filter');
        // Verify the JWT token and extract the user details.
        token = _.replace(event.headers['Authorization'], 'Bearer ', '');
        const user = await jwt.verify(token);
        // Update the JWT token to extend the timeout
        token = await jwt.sign(_.omit(user, ['iat', 'exp']));
        event = _.assign({}, event, {user});
      } catch (err) {
        console.log('jwt.verify failed');
        console.log(JSON.stringify(err, null, 3));
        return callback(null, {
          statusCode: 403,
          headers: HEADERS,
          body: JSON.stringify({ ok: false, error: 'User is unathorized to make this request.' })
        });
      }
    }
    const routeModule = require(routeModulePath); // eslint-disable-line
    const result = await routeModule(event);
    console.log(`${routeModulePath} complete`);
    console.log(JSON.stringify(result));
    return callback(null, {
      statusCode: result.statusCode,
      headers: HEADERS,
      body: JSON.stringify(_.merge({}, result.body, {token}))
    });
  }
  catch (e) {
    if (e.code && _.isEqual(e.code, 'MODULE_NOT_FOUND')) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ ok: false, error: `Route not found, ${routeModulePath}` , token})
      });
    }
    console.error(e);
    return callback(null, {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ ok: false, error: 'Unknown server error.' , token})
    });
  }
};
