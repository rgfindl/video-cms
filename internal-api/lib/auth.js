const _ = require("lodash");
const googleAuthLibrary = require('./googleAuthLibrary');

module.exports = async (token) => {
  const ticket = await googleAuthLibrary.verifyIdToken({
      idToken: token,
      audience: process.env.GapiClientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  if (!_.isEqual(payload['aud'], process.env.GapiClientId)) {
    throw new Error('Token does not match our Google API Client Id.');
  }
  const user_id = payload['sub'];
  return {
    id: user_id,
    type: 'user',
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  }
}