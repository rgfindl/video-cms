const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

var functions = {};

functions.sendMessage = (params) => {
  console.log('sqs.sendMessage');
  return sqs.sendMessage({
    QueueUrl: process.env.TasksQueue,
    MessageBody: JSON.stringify(params.message),
    DelaySeconds: params.delaySeconds
  }).promise();
};

module.exports = functions;
