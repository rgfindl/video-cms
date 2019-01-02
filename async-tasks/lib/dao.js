const AWS = require('aws-sdk');
const _ = require('lodash');

const docClient = new AWS.DynamoDB.DocumentClient();

var functions = {};

functions.put = (input) => {
  console.log('dao.put');
  const params = {
    TableName: process.env.Table,
    Item: {
      hash_key: input.id,
      sort_key: input.type,
    }
  };
  params.Item[input.type] = input;
  console.log(JSON.stringify(params, null, 3));
  return docClient.put(params).promise();
};

functions.update = (input) => {
  console.log('dao.update');
  const params = {
    TableName: process.env.Table,
    Key: {
      hash_key: input.id,
      sort_key: input.type
    },
    UpdateExpression: `set ${input.type} = :input`,
    ExpressionAttributeValues:{
      ':input': input
    },
    ReturnValues:"UPDATED_NEW"
  };
  console.log(JSON.stringify(params, null, 3));
  return docClient.update(params).promise();
};

functions.get = (input) => {
  console.log('dao.get');
  const params = {
    TableName: process.env.Table,
    Key: {
      hash_key: input.id,
      sort_key: input.type
    }
  };
  return docClient.get(params).promise();
};

functions.delete = (input) => {
  console.log('dao.delete');
  const params = {
    TableName: process.env.Table,
    Key: {
      hash_key: input.id,
      sort_key: input.type
    }
  };
  return docClient.delete(params).promise();
};

module.exports = functions;
