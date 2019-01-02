
const mediaconvert = require('../lib/mediaconvert');
const dao = require('../lib/dao');
const queue = require('../lib/queue');
const _ = require('lodash');

const DELAY = 30;

module.exports = async (task) => {
  console.log('check-status');

  // Get the video
  const videoResult = await dao.get({type: 'video', id: task.video_id});
  if (!videoResult.Item || !videoResult.Item.video) {
    console.log('Video not found.');
    return;
  }
  const video = videoResult.Item.video;
  
  // Get the endpoint
  const describeEndpointsResult = await mediaconvert.describeEndpoints({});
  const endpoint = describeEndpointsResult.Endpoints[0].Url;

  //
  // Get job
  // 
  const getJobRequest = {
    Id: task.mediaconvert_job_id
  };
  const getJobResult = await mediaconvert.getJob(endpoint, getJobRequest);

  // Is the encoding done?
  if (_.includes(["SUBMITTED", "PROGRESSING"], getJobResult.Job.Status)) {
    // Nope.  Still encoding.
    // Have we tried enouph?
    if (task.retries && task.retries > ((24 * 60 * 60) / DELAY)) {
      // Yep.  We've been trying for 24 hours.  Lets give up.
      console.log('Timedout');
      // Update video with status
      const updatedVideo = _.assign(
        {}, 
        video, 
        { 
          type: 'video',
          updated_on: (new Date()).getTime(),  // Set the updated on time
          status: 'error',
          error: 'Encoding timed out'
        }
      );
    
      // Update video
      await dao.update(updatedVideo);
      return;
    }
    // Add another check-status task.
    console.log('Requeue status check');
    await queue.sendMessage({
      message: {
        action: 'check-status',
        video_id: task.video_id,
        mediaconvert_job_id: task.mediaconvert_job_id,
        streams: task.streams,
        thumbnail: task.thumbnail,
        retries: (task.retries ? task.retries : 0) + 1
      },
      delaySeconds: DELAY
    });
    return;
  }

  // Encoding is complete.
  console.log('Encoding complete.');
  // Update video with status
  const updatedVideo = _.assign(
    {}, 
    video, 
    { 
      type: 'video',
      updated_on: (new Date()).getTime(),  // Set the updated on time
      streams: _.includes(["COMPLETE"], getJobResult.Job.Status) ? task.streams : null,
      thumbnail: _.includes(["COMPLETE"], getJobResult.Job.Status) ? task.thumbnail : null,
      status: _.includes(["COMPLETE"], getJobResult.Job.Status) ? 'ready' : 'error',
      error: _.includes(["COMPLETE"], getJobResult.Job.Status) ? null : getJobResult.Job.ErrorMessage
    }
  );

  // Update video
  await dao.update(updatedVideo);
};