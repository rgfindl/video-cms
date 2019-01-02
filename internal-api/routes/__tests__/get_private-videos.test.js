beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('GET /private/videos', () => {
  it('videos', async () => {
    jest.mock('../../lib/es', () => ({ 
      search: (params) => {
        return {
          hits: {
            hits: [
              {
                _source: {
                  video: {
                    id: '1',
                    title: 'title',
                    description: 'desc'
                  }
                }
              },
              {
                _source: {
                  video: {
                    id: '2',
                    title: 'title',
                    description: 'desc'
                  }
                }
              }
            ]
          }
        }
      }
    }));
    const route = require('../get_private-videos');
    const response = await route({
      user: {
        id: '1'
      }
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.videos.length).toBe(2);
    expect(response.body.videos[0].id).toBe('1');
  });
});