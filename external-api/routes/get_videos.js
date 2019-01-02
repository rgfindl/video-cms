const _ = require('lodash');
const dao = require('../lib/dao');

const fetchVideo = async (id) => {
  const result = await dao.get({type: 'video', id});
  console.log(JSON.stringify(result, null, 3));
  return {
    statusCode: 200,
    body: {
      ok: true,
      video: result.Item ? result.Item.video : null
    }
  };
}

module.exports = async (event) => {
  if (event.queryStringParameters && event.queryStringParameters.id) {
    return await fetchVideo(event.queryStringParameters.id);
  }
  return {
    statusCode: 400,
    body: {
      ok: false,
      error: 'Please provide an id query param.'
    }
  };
};
