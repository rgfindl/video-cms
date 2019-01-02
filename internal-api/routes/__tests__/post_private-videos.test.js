beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('POST /private/videos', () => {
  it('videos', async () => {

    const mockFn = jest.fn(() => {
      return {
        statusCode: 200,
        body: {
          ok: true,
          video: {}
        }
      }
    });

    jest.mock('../../lib/dao', () => ({ 
      put: mockFn
    }));

    const route = require('../post_private-videos');
    const response = await route({
      user: {
        id: 'user-id'
      },
      body: JSON.stringify({
        title: 'title'
      })
    });

    expect(mockFn.mock.calls[0][0].user_id).toBe('user-id');
    expect(mockFn.mock.calls[0][0].id).toBeDefined();
    expect(mockFn.mock.calls[0][0].created_on).toBeDefined();

    expect(response.body.ok).toBe(true);
    expect(response.body.video.title).toBe('title');
  });
});