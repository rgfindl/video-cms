const _ = require('lodash');
const es = require('../lib/es');
const dao = require('../lib/dao');

const fetchVideo = async (id) => {
  // Search user videos
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

const fetchVideos = async (event) => {
  // Search user videos
  const searchResults = await es.search({q: `sort_key:video AND video.user_id:${event.user.id}`, sort: 'video.created_on:desc'});
  const videos = searchResults.hits && searchResults.hits.hits ? 
    _.map(searchResults.hits.hits, '_source.video') : 
    [];
  return {
    statusCode: 200,
    body: {
      ok: true,
      videos
    }
  };
}

module.exports = async (event) => {
  if (event.queryStringParameters && event.queryStringParameters.id) {
    return await fetchVideo(event.queryStringParameters.id);
  }
  return await fetchVideos(event);
};
