import axios from 'axios';
import * as api from './api';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

it('api 500 error', async () => {
  const error = new Error('Unauthorized');
  error.code = 500;
  axios.get.mockRejectedValue(error);
  try {
    await api.fetchVideos();
    const success = new Error();
    success.code = 200;
    throw success;
  } catch (err) {
    expect(err.code).toBe(500);
  }
});
it('get videos', async () => {
  axios.get.mockResolvedValue({
    data: {
      ok: true,
      videos: [
        {
          id: 'id',
          title: 'title',
          description: 'desc'
        }
      ]
    }
  });
  try {
    const response = await api.fetchVideos();
    expect(response.ok).toBe(true);
    expect(response.videos[0].id).toBe('id');
  } catch (err) {
    console.error(err);
    expect(false).toBe(true);  // Should not get here.
  }
});
it('save video', async () => {
  axios.post.mockResolvedValue({
    data: {
      ok: true,
      video: {
        id: 'id',
        title: 'title',
        description: 'desc'
      }
    }
  });
  try {
    const response = await api.saveVideo({});
    expect(response.ok).toBe(true);
    expect(response.video.id).toBe('id');
  } catch (err) {
    console.error(err);
    expect(false).toBe(true);  // Should not get here.
  }
});
it('update video', async () => {
  axios.put.mockResolvedValue({
    data: {
      ok: true,
      video: {
        id: 'id',
        title: 'title',
        description: 'desc'
      }
    }
  });
  try {
    const response = await api.updateVideo({});
    expect(response.ok).toBe(true);
    expect(response.video.id).toBe('id');
  } catch (err) {
    console.error(err);
    expect(false).toBe(true);  // Should not get here.
  }
});