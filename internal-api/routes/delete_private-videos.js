const _ = require('lodash');
const dao = require('../lib/dao');
const s3 = require('../lib/s3');

//
// Add user video
//
module.exports = async (event) => {
  console.log('delete video');
  if (event.queryStringParameters && event.queryStringParameters.id) {
    // Get video
    const videoResult = await dao.get({type: 'video', id: event.queryStringParameters.id});
    if (videoResult.Item && videoResult.Item.video) {
      const video = videoResult.Item.video;
      // Delete video
      await dao.delete({type: 'video', id: video.id});

      // Delete assets
      try {
        const keyPrefix = _.join(_.initial(_.split(_.replace(video.url, `https://${process.env.AssetsCloudFront}/`, ''), '/')), '/');
        await s3.deleteDirectory(keyPrefix);
      } catch (err) {
        console.error(e);
      }

      return {
        statusCode: 200,
        body: {
          ok: true,
          video
        }
      };
    } else {
      return {
        statusCode: 404,
        body: {
          ok: true,
          error: 'video not found'
        }
      };
    }
  } else {
    return {
      statusCode: 400,
      body: {
        ok: true,
        error: 'mising id query param'
      }
    };
  }
};
