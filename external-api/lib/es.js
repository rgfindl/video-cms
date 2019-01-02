const _ = require('lodash');
const HttpAwsEs = require('http-aws-es');
const Elasticsearch = require('elasticsearch');
const options = {
  hosts: [process.env.ElasticsearchDomain], // array of amazon es hosts (required)
  connectionClass: HttpAwsEs, // use this connector (required)
};
const es = Elasticsearch.Client(options);

//
// Handles Elasticsearch calls.
//
const functions = {};

functions.search = (params) => {
  console.log(JSON.stringify(_.merge({}, {
    index: process.env.ElasticsearchIndex
  }, params)));
  return es.search(_.merge({}, {
    index: process.env.ElasticsearchIndex
  }, params));
};

module.exports = functions;
