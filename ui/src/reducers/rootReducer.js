import { combineReducers } from 'redux';
import displayReducer from './displayReducer';
import videoReducer from './videoReducer';
import userReducer from './userReducer';
import videosReducer from './videosReducer';
export default combineReducers({
 display: displayReducer, 
 videoForm: videoReducer,
 user: userReducer,
 videos: videosReducer
});