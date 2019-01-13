export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_VIDEOS_ACTION':
      return {
        ...state,
        videos: action.videos
      }
  default:
    return state;
  }
}