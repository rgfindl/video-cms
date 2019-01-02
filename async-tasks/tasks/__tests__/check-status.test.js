beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('check-status', () => {
  it('test', async () => {
    process.env.Table = 'heyblue-db-Table-1TA6IOEQPV4ZG';
    process.env.AssetsCloudFront = "d1hwbzaodu4avx.cloudfront.net";
    process.env.AssetsBucket = "heyblue-assets-assetsbucket-16seezun0g9i0";
    process.env.MediaConvertRole = "arn:aws:iam::813715622461:role/heyblue-iam-IamRoleMediaConvert-176RHN6GT1F2F";
    
    const mockFnUpdate = jest.fn(() => {
      return {
        statusCode: 200,
        body: {
          ok: true,
          video: {}
        }
      }
    });
    const mockFnGet = jest.fn(() => {
      return {
        statusCode: 200,
        Item: {
          video: {
            id: 'b7e374cb-d77c-4403-d091-dee2ea8bb503'
          }
        }
      }
    });

    jest.mock('../../lib/dao', () => ({ 
      update: mockFnUpdate,
      get: mockFnGet
    }));

    const checkStatus = require('../check-status');
    try {
      await checkStatus({
        "action": "check-status",
        "video_id": "b7e374cb-d77c-4403-d091-dee2ea8bb503",
        "mediaconvert_job_id": "1544634666378-f9bdxx"
      });
      console.log(JSON.stringify(mockFnUpdate.mock.calls[0][0], null, 3));
    } catch (err) {
      console.log(err);
    }
  });
});