const s3 = require('../lib/s3');
const uuid = require('../lib/uuid');

module.exports = async (event) => {
  const body = JSON.parse(event.body);
  console.log(JSON.stringify(body, null, 3));
  await s3.abortMultipartUpload(body.key, body.uploadId);
  return {
    statusCode: 200,
    body: {
      ok: true,
      body: { }
    }
  };
};