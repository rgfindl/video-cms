beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('PUT /private/videos', () => {
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
      update: mockFn
    }));

    const route = require('../put_private-videos');
    const response = await route({
      user: {
        id: 'user-id'
      },
      body: JSON.stringify({
        id: 'uuid',
        title: 'title'
      })
    });

    expect(mockFn.mock.calls[0][0].id).toBeDefined();
    expect(mockFn.mock.calls[0][0].updated_on).toBeDefined();

    expect(response.body.ok).toBe(true);
    expect(response.body.video.title).toBe('title');

  });
});