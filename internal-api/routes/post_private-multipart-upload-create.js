const s3 = require('../lib/s3');
const uuid = require('../lib/uuid');

module.exports = async (event) => {
  const body = JSON.parse(event.body);
  console.log(JSON.stringify(body, null, 3));
  const result = await s3.createMultipartUpload(`${uuid()}/${body.file.name}`);
  console.log(JSON.stringify(result, null, 3));
  return {
    statusCode: 200,
    body: {
      ok: true,
      body: {
        uploadId: result.UploadId,
        key: result.Key,
        bucket: result.Bucket
      }
    }
  };
};