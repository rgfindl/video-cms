beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('encode', () => {
  it('test', async () => {
    process.env.Table = 'heyblue-db-Table-1TA6IOEQPV4ZG';
    process.env.AssetsCloudFront = "d1hwbzaodu4avx.cloudfront.net";
    process.env.AssetsBucket = "heyblue-assets-assetsbucket-16seezun0g9i0";
    process.env.MediaConvertRole = "arn:aws:iam::813715622461:role/heyblue-iam-IamRoleMediaConvert-176RHN6GT1F2F";
    const encode = require('../encode');
    try {
      // await encode({
      //   "action": "encode",
      //   "video_id": "b7e374cb-d77c-4403-d091-dee2ea8bb503",
      //   "url": "https://d1hwbzaodu4avx.cloudfront.net/3440ca1d-8288-bbb7-2262-0660ee6e0c66/10-26-2018-t_97a8f4a460eb421eb0f41dfed5a8285b_name_t_adbef13e41744de4b31878e4d60ce770_name_20180716_QA_Video_1.mp4",
      //   "old_url": "https://d1hwbzaodu4avx.cloudfront.net/f25f2bb3-8250-5335-84d6-fe7bc8b5c46d/10-26-2018-t_97a8f4a460eb421eb0f41dfed5a8285b_name_t_adbef13e41744de4b31878e4d60ce770_name_20180716_QA_Video_1.mp4"
      // });
    } catch (err) {
      console.log(err);
    }
  });
});