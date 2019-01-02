
import axios from 'axios';

const callWrapper = async (call, url, body) => {
  try {
    const response = await call(url, body);
    return response.data;
  } catch (error) {
    const newError = new Error('Unknown server error.  Please try again.');
    newError.code = 500;
    if (error.response && error.response.status) {
      newError.code = error.response.status;
    }
    if (error.response && error.response.data && error.response.data.error) {
      newError.message = error.response.data.error;
    }
    throw newError;
  }
};

export const init =  (host, setCurrentUser) => {
  axios.defaults.baseURL = host;
  axios.interceptors.request.use((config) => {
    if (sessionStorage.getItem('currentUserToken')) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${sessionStorage.getItem('currentUserToken')}`
      };
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    // Add the updated auth token if it is in the response.
    if (response.data.token) {
      sessionStorage.setItem('currentUserToken', response.data.token);
    }
    return response;
  }, function (error) {
    if (error.response && error.response.status && error.response.status === 403) {
      setCurrentUser(null);
    }
    return Promise.reject(error);
  });
}

export const login = async (token) => {
  return await callWrapper(axios.post, `/login?token=${token}`);
};

export const fetchVideo = async (id) => {
  return await callWrapper(axios.get, `/private/videos?id=${id}`);
};

export const deleteVideo = async (id) => {
  return await callWrapper(axios.delete, `/private/videos?id=${id}`);
};

export const fetchVideos = async () => {
  return await callWrapper(axios.get, '/private/videos');
};

export const saveVideo = async (video) => {
  return await callWrapper(axios.post, '/private/videos', video);
};

export const updateVideo = async (video) => {
  return await callWrapper(axios.put, `/private/videos`, video);
};

export const createMultipartUpload = async (file) => {
  return await callWrapper(axios.post, `/private/multipart/upload/create`, {file});
};

export const listMultipartUploadParts = async (file, { uploadId, key }) => {
  return await callWrapper(axios.get, `/private/multipart/upload/parts`, {params:  { file, uploadId, key }});
};

export const prepareMultipartUploadPart = async (file, partData) => {
  return await callWrapper(axios.post, `/private/multipart/upload/prepare`, { file, partData });
};

export const abortMultipartUpload = async (file, { uploadId, key }) => {
  return await callWrapper(axios.post, `/private/multipart/upload/abort`, {params:  { file, uploadId, key }});
};

export const completeMultipartUpload = async (file, { uploadId, key, parts }) => {
  return await callWrapper(axios.post, `/private/multipart/upload/complete`, { file, uploadId, key, parts });
};
