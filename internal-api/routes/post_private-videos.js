const _ = require('lodash');
const dao = require('../lib/dao');
const queue = require('../lib/queue');
const uuid = require('../lib/uuid');

//
// Add user video
//
module.exports = async (event) => {
  console.log('post video');

  // Prepare new video
  const video = _.assign(
    {}, 
    JSON.parse(event.body), 
    { 
      id: uuid(), // Generate new uuid
      user_id: event.user.id, // Set the current user id
      created_on: (new Date()).getTime(), // Set the created on time
      type: 'video',
      status: 'pending'
    }
  );
  console.log(JSON.stringify(video, null, 3));

  // Add video
  await dao.put(video);

  // Create encode job
  await queue.sendMessage({
    message: {
      action: 'encode',
      video_id: video.id,
      url: video.url
    }
  });
  
  return {
    statusCode: 200,
    body: {
      ok: true,
      video
    }
  };
};
