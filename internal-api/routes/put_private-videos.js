const _ = require('lodash');
const dao = require('../lib/dao');
const queue = require('../lib/queue');

//
// Update user video
//
module.exports = async (event) => {
  console.log('put video');
  const video = JSON.parse(event.body);

  // Get video
  const videoResult = await dao.get({type: 'video', id: video.id});

  if (videoResult.Item && videoResult.Item.video) {
    const reencode = !_.isEqual(videoResult.Item.video.url, video.url);

    // Prepare video
    const updatedVideo = _.assign(
      {}, 
      video, 
      { 
        type: 'video',
        updated_on: (new Date()).getTime(),  // Set the updated on time
        status: reencode ? 'pending' : video.status,
        error: reencode ? null : video.error
      }
    );

    // Update video
    await dao.update(updatedVideo);

    if (reencode) {
      // We have a new video.
      // Create encode job
      await queue.sendMessage({
        message: {
          action: 'encode',
          video_id: video.id,
          url: video.url,
          old_url: videoResult.Item.video.url
        }
      });
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
};
