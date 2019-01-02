const s3 = require('../lib/s3');
const uuid = require('../lib/uuid');

module.exports = async (event) => {
  const body = JSON.parse(event.body);
  console.log(JSON.stringify(body, null, 3));
  const response = await s3.completeMultipartUpload(body.key, body.uploadId, body.parts);
  console.log(JSON.stringify(response, null, 3));
  return {
    statusCode: 200,
    body: {
      ok: true,
      body: {
        location: `https://${process.env.AssetsCloudFront}/${body.key}`
      }
    }
  };
};