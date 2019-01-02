
const mediaconvert = require('../lib/mediaconvert');
const dao = require('../lib/dao');
const queue = require('../lib/queue');
const s3 = require('../lib/s3');
const _ = require('lodash');
const horizontalJobTemplate = require('../resources/horizontal.json');

module.exports = async (task) => {
  console.log('encode');

  // Get the video
  const videoResult = await dao.get({type: 'video', id: task.video_id});
  if (!videoResult.Item || !videoResult.Item.video) {
    console.log('Video not found.');
    return;
  }
  const video = videoResult.Item.video;
  
  // Get the endpoint
  const describeEndpointsResult = await mediaconvert.describeEndpoints({});
  console.log(JSON.stringify(describeEndpointsResult, null, 3));
  const endpoint = describeEndpointsResult.Endpoints[0].Url;
  
  // Get the queue
  const listQueuesResult = await mediaconvert.listQueues(endpoint, {});
  console.log(JSON.stringify(listQueuesResult, null, 3));
  const mcQueue = listQueuesResult.Queues[0].Arn;

  //
  // Create job
  // 
  const createJobRequest = _.assign({}, horizontalJobTemplate, {
    Queue: mcQueue,
    Role: process.env.MediaConvertRole
  });
  // Add input
  createJobRequest.Settings.Inputs[0].FileInput = _.replace(task.url, `https://${process.env.AssetsCloudFront}`, `s3://${process.env.AssetsBucket}`);
  // Add output and record streams
  const keyPrefix = _.join(_.initial(_.split(_.replace(task.url, `https://${process.env.AssetsCloudFront}/`, ''), '/')), '/');
  const s3UrlPrefix = `s3://${process.env.AssetsBucket}/${keyPrefix}`;
  const cfUrlPrefix = `https://${process.env.AssetsCloudFront}/${keyPrefix}`;
  const streams = [];
  let thumbnail;
  _.forEach(createJobRequest.Settings.OutputGroups, (outputGroup) => {
    if (outputGroup.OutputGroupSettings.HlsGroupSettings) {
      outputGroup.OutputGroupSettings.HlsGroupSettings.Destination = `${s3UrlPrefix}/${outputGroup.Name}`;
      let width = 0;
      let height = 0;
      let container;
      _.forEach(outputGroup.Outputs, (output) => {
        if (output.VideoDescription) {
          if (output.VideoDescription.Width > width) {
            width = output.VideoDescription.Width;
            height = output.VideoDescription.Height;
          }
          container = _.toLower(output.ContainerSettings.Container);
      }
      });
      streams.push({
        url: `${cfUrlPrefix}/${outputGroup.Name}.${container}`,
        width: width,
        height: height,
        type: 'hls'
      });
    } else if (outputGroup.OutputGroupSettings.FileGroupSettings) {
      outputGroup.OutputGroupSettings.FileGroupSettings.Destination = `${s3UrlPrefix}/${outputGroup.Name}`;
      _.forEach(outputGroup.Outputs, (output) => {
        if (output.VideoDescription.Width) {
          streams.push({
            url: `${cfUrlPrefix}/${outputGroup.Name}${output.NameModifier}.${_.toLower(output.ContainerSettings.Container)}`,
            width: output.VideoDescription.Width,
            height: output.VideoDescription.Height,
            type: 'file'
          });
        } else {
          thumbnail = `${cfUrlPrefix}/${outputGroup.Name}${output.NameModifier}.0000000.${_.toLower(output.Extension)}`;
        }
      });
    }
  });
  //console.log(JSON.stringify(createJobRequest, null, 3));
  //console.log(JSON.stringify(streams, null, 3));
  const createJobResult = await mediaconvert.createJob(endpoint, createJobRequest);

  // Add streams to video
  const updatedVideo = _.assign(
    {}, 
    video, 
    { 
      type: 'video',
      updated_on: (new Date()).getTime(),  // Set the updated on time
      status: 'encoding'
    }
  );

  // Update video
  await dao.update(updatedVideo);

  // Add check-status task.
  await queue.sendMessage({
    message: {
      action: 'check-status',
      video_id: video.id,
      mediaconvert_job_id: createJobResult.Job.Id,
      streams,
      thumbnail
    },
    delaySeconds: 30
  });

  // Do we have an old video to clean up?
  if (task.old_url) {
      // Delete assets
      try {
        const keyPrefix = _.join(_.initial(_.split(_.replace(task.old_url, `https://${process.env.AssetsCloudFront}/`, ''), '/')), '/');
        await s3.deleteDirectory(keyPrefix);
      } catch (err) {
        console.error(e);
      }
  }
};