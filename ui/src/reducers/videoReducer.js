import _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case 'SHOW_UPLOAD_PROGRESS_ACTION':
      return {
        ...state,
        uploadProgress: true
      }
    case 'HIDE_UPLOAD_PROGRESS_ACTION':
      return {
        ...state,
        uploadProgress: false
      }
    case 'SHOW_SAVE_PROGRESS_ACTION':
      return {
        ...state,
        saveProgress: true
      }
    case 'HIDE_SAVE_PROGRESS_ACTION':
      return {
        ...state,
        saveProgress: false
      }
    case 'SHOW_DELETE_PROGRESS_ACTION':
      return {
        ...state,
        deleteProgress: true
      }
    case 'HIDE_DELETE_PROGRESS_ACTION':
      return {
        ...state,
        deleteProgress: false
      }
    case 'SAVE_COMPLETE_ACTION':
      return {
        ...state,
        saveComplete: action.complete
      }
    case 'DELETE_COMPLETE_ACTION':
      return {
        ...state,
        deleteComplete: action.complete
      }
    case 'DELETE_CONFIRMATION_ACTION':
      return {
        ...state,
        deleteConfirmation: action.confirmation
      }
    case 'UPDATE_VIDEO_ACTION':
      return {
        ...state,
        video: _.assign(state.video, action.video)
      }
    case 'SET_VIDEO_INPUT_ACTION':
      return {
        ...state,
        video: _.assign(state.video, {[action.key]: action.value })
      }
    case 'SET_FIELD_VALID_ACTION':
      return {
        ...state,
        [action.field]: action.valid
      }
    case 'SET_FIELD_CHANGED_ACTION':
      return {
        ...state,
        [action.field]: action.changed
      }
    case 'SET_FORM_ERRORS_ACTION':
      return {
        ...state,
        formErrors: action.formErrors
      }
    case 'SET_FORM_VALID_ACTION':
      return {
        ...state,
        formValid: action.valid
      }
  default:
    return state;
  }
}