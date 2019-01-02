const AWS = require('aws-sdk');
const s3 = new AWS.S3();

var functions = {};

functions.createMultipartUpload = (key) => {
  console.log('s3.createMultipartUpload');
  return s3.createMultipartUpload({
    Bucket: process.env.AssetsBucket,
    Key: key,
    ACL: 'public-read'
  }).promise();
};

functions.completeMultipartUpload = (key, uploadId, parts) => {
  console.log('s3.completeMultipartUpload');
  return s3.completeMultipartUpload({
    Bucket: process.env.AssetsBucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts
    }
  }).promise();
};

functions.abortMultipartUpload = (key, uploadId) => {
  console.log('s3.abortMultipartUpload');
  return s3.abortMultipartUpload({
    Bucket: process.env.AssetsBucket,
    Key: key,
    UploadId: uploadId
  }).promise();
};

functions.getSignedUrl = (key, uploadId, partNumber) => {
  console.log('s3.getSignedUrl');
  return s3.getSignedUrl('uploadPart', {
    Bucket: process.env.AssetsBucket,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    Body: '', // Empty, because it is uploaded later
    Expires: 15 * 60
  });
}

functions.delete = (key) => {
  console.log('s3.delete');
  return s3.deleteObject({
    Bucket: process.env.AssetsBucket,
    Key: key,
  }).promise();
}

functions.deleteDirectory = async (dir) => {
  const listParams = {
      Bucket: process.env.AssetsBucket,
      Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
      Bucket: process.env.AssetsBucket,
      Delete: { Objects: [] }
  };

  listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await functions.deleteDirectory(dir);
}

module.exports = functions;
