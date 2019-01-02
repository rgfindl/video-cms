beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('/login', () => {
  it('success', async () => {
    const mockFn = jest.fn(() => {
      return {
        aud: 'gapi-client-id',
        sub: 'userid',
        name: 'Randy',
        email: 'rgfindley@gmail.com',
        picture: 'profile.jpg'
      }
    });
    jest.mock('../../lib/auth', () => { return mockFn; });

    jest.mock('../../lib/dao', () => ({ 
      put: (obj) => {
        expect(obj.name).toBe('Randy');
        return {};
      }
    }));

    jest.mock('../../lib/jwt', () => ({ 
      sign: (obj) => {
        expect(obj.name).toBe('Randy');
        return 'jwt-token';
      }
    }));
    
    const route = require('../post_login');
    const response = await route({
      queryStringParameters: {
        token: 'token'
      }
    });

    expect(mockFn.mock.calls[0][0]).toBe('token');

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.user.name).toBe('Randy');
    expect(response.body.user.token).toBe('jwt-token');
  });


  it('unauthorized', async () => {
    const mockFn = jest.fn(() => {
      throw new Error();
    });
    jest.mock('../../lib/auth', () => { return mockFn; });
    
    const route = require('../post_login');

    const response = await route({
      queryStringParameters: {
        token: 'token'
      }
    });

    expect(mockFn.mock.calls[0][0]).toBe('token');

    expect(response.statusCode).toBe(403);
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBe('Invalid Google Auth Token.');
  });
});