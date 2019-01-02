const AWS = require('aws-sdk');

const functions = {};

functions.createJob = (endpoint, params) => {
  console.log('mediaconvert.createJob');
  const mediaconvert = new AWS.MediaConvert({endpoint});
  return mediaconvert.createJob(params).promise();
};

functions.getJob = (endpoint, params) => {
  console.log('mediaconvert.getJob');
  const mediaconvert = new AWS.MediaConvert({endpoint});
  return mediaconvert.getJob(params).promise();
};

functions.listQueues = (endpoint, params) => {
  console.log('mediaconvert.listQueues');
  const mediaconvert = new AWS.MediaConvert({endpoint});
  return mediaconvert.listQueues(params).promise();
};

functions.describeEndpoints = (params) => {
  console.log('mediaconvert.describeEndpoints');
  const mediaconvert = new AWS.MediaConvert();
  return mediaconvert.describeEndpoints(params).promise();
};

module.exports = functions;
