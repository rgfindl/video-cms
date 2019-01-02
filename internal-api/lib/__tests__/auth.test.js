beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('auth', () => {
  it('test sunny day', async () => {
    const GapiClientId = 'gapi-client-id';
    process.env.GapiClientId = GapiClientId;
    jest.mock('../googleAuthLibrary', () => ({ 
      verifyIdToken: (params) => {
        return {
          getPayload: () => {
            return {
              aud: 'gapi-client-id',
              sub: 'userid',
              name: 'Randy',
              email: 'rgfindley@gmail.com',
              picture: 'profile.jpg'
            }
          }
        }
      }
    }));
    const auth = require('../auth');
  
    const user = await auth('token');
    expect(user.name).toBe('Randy');
    expect(user.type).toBe('user');
  });

  it('test invalid token (aud)', async () => {
    const GapiClientId = 'gapi-client-id';
    process.env.GapiClientId = GapiClientId;
    jest.mock('../googleAuthLibrary', () => ({ 
      verifyIdToken: (params) => {
        return {
          getPayload: () => {
            return {
              aud: 'gapi-client-id - invalid',
              sub: 'userid',
              name: 'Randy',
              email: 'rgfindley@gmail.com',
              picture: 'profile.jpg'
            }
          }
        }
      }
    }));
    const auth = require('../auth');
  
    try {
      const user = await auth('token');
      expect(true).toBe(false); // Shouldn't get here.
    } catch (err) {
      expect(err.message).toBe('Token does not match our Google API Client Id.');
    }
  });
});