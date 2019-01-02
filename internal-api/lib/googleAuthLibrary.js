
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GapiClientId);

module.exports = {
  verifyIdToken: async (params) => {
    return await client.verifyIdToken(params);
  }
};