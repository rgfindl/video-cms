const jwt = require('../lib/jwt');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('index', () => {
  it('OPTIONS', async () => {
    const index = require('../index');
    await index.handler({
      httpMethod: 'OPTIONS'
    }, {}, (err, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });

  it('404', async () => {
    const index = require('../index');
    await index.handler({
      httpMethod: 'GET',
      path: '/not-found'
    }, {}, (err, response) => {
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body).ok).toBe(false);
      expect(JSON.parse(response.body).error).toBe('Route not found, ./routes/get_not-found');
    });
  });

  it('403 no token', async () => {
    const index = require('../index');
    await index.handler({
      httpMethod: 'GET',
      path: '/private/not-authorized'
    }, {}, (err, response) => {
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).ok).toBe(false);
      expect(JSON.parse(response.body).error).toBe('User is unathorized to make this request.');
    });
  });

  it('403 invalid token', async () => {
    const index = require('../index');
    await index.handler({
      httpMethod: 'GET',
      path: '/private/not-authorized',
      headers: {
        Authorization: `Bearer invalid-token`
      }
    }, {}, (err, response) => {
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).ok).toBe(false);
      expect(JSON.parse(response.body).error).toBe('User is unathorized to make this request.');
    });
  });

  it('500', async () => {
    jest.mock('../routes/get_mock', () => { throw new Error(); }, {virtual: true});
    const index = require('../index');
    await index.handler({
      httpMethod: 'GET',
      path: '/mock'
    }, {}, (err, response) => {
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).ok).toBe(false);
      expect(JSON.parse(response.body).error).toBe('Unknown server error.');
    });
  });

  it('auth', async () => {
    const mockFn = jest.fn(() => {
      return {
        statusCode: 200,
        body: {
          ok: true
        }
      }
    });
    jest.mock('../routes/get_private-mock', () => { return mockFn; }, {virtual: true});
    const index = require('../index');
    process.env.JwtSecret = 'sheee';
    const token = await jwt.sign({name: 'Randy'});
    await index.handler({
      httpMethod: 'GET',
      path: '/private/mock',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, {}, (err, response) => {
      expect(mockFn.mock.calls[0][0].user.name).toBe('Randy');
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).ok).toBe(true);
    });
  });
});