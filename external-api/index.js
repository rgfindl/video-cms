const _ = require('lodash');

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Cache-Control': 'max-age=10'
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
  try {
    const routeModule = require(routeModulePath); // eslint-disable-line
    const result = await routeModule(event);
    console.log(`${routeModulePath} complete`);
    console.log(JSON.stringify(result));
    return callback(null, {
      statusCode: result.statusCode,
      headers: HEADERS,
      body: JSON.stringify(_.merge({}, result.body))
    });
  }
  catch (e) {
    if (e.code && _.isEqual(e.code, 'MODULE_NOT_FOUND')) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ ok: false, error: `Route not found, ${routeModulePath}`})
      });
    }
    console.error(e);
    return callback(null, {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ ok: false, error: 'Unknown server error.'})
    });
  }
};
