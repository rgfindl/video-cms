

export const setVideosAction = (videos) => dispatch => {
  dispatch({
    type: 'SET_VIDEOS_ACTION',
    videos
  })
}