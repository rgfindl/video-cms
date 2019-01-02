const s3 = require('../lib/s3');
const uuid = require('../lib/uuid');

module.exports = async (event) => {
  const body = JSON.parse(event.body);
  console.log(JSON.stringify(body, null, 3));
  const url = await s3.getSignedUrl(body.partData.key, body.partData.uploadId, body.partData.number);
  console.log(JSON.stringify(url, null, 3));
  return {
    statusCode: 200,
    body: {
      ok: true,
      body: {
        url
      }
    }
  };
};