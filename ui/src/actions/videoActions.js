export const showUploadProgressAction = () => dispatch => {
  dispatch({
    type: 'SHOW_UPLOAD_PROGRESS_ACTION'
  })
}

export const hideUploadProgressAction = () => dispatch => {
  dispatch({
    type: 'HIDE_UPLOAD_PROGRESS_ACTION'
  })
}

export const showSaveProgressAction = () => dispatch => {
  dispatch({
    type: 'SHOW_SAVE_PROGRESS_ACTION'
  })
}

export const hideSaveProgressAction = () => dispatch => {
  dispatch({
    type: 'HIDE_SAVE_PROGRESS_ACTION'
  })
}

export const showDeleteProgressAction = () => dispatch => {
  dispatch({
    type: 'SHOW_DELETE_PROGRESS_ACTION'
  })
}

export const hideDeleteProgressAction = () => dispatch => {
  dispatch({
    type: 'HIDE_DELETE_PROGRESS_ACTION'
  })
}

export const saveCompleteAction = (complete) => dispatch => {
  dispatch({
    type: 'SAVE_COMPLETE_ACTION',
    complete
  })
}

export const deleteCompleteAction = (complete) => dispatch => {
  dispatch({
    type: 'DELETE_COMPLETE_ACTION',
    complete
  })
}

export const deleteConfirmationAction = (confirmation) => dispatch => {
  dispatch({
    type: 'DELETE_CONFIRMATION_ACTION',
    confirmation
  })
}

export const updateVideoAction = (video) => dispatch => {
  dispatch({
    type: 'UPDATE_VIDEO_ACTION',
    video
  })
}

export const setVideoInputAction = (key, value) => dispatch => {
  dispatch({
    type: 'SET_VIDEO_INPUT_ACTION',
    key, 
    value
  })
}

export const setFieldValidAction = (field, valid) => dispatch => {
  dispatch({
    type: 'SET_FIELD_VALID_ACTION',
    field, 
    valid
  })
}

export const setFieldChangedAction = (field, changed) => dispatch => {
  dispatch({
    type: 'SET_FIELD_CHANGED_ACTION',
    field, 
    changed
  })
}

export const setFormErrorsAction = (formErrors) => dispatch => {
  dispatch({
    type: 'SET_FORM_ERRORS_ACTION',
    formErrors
  })
}

export const setFormValidAction = (valid) => dispatch => {
  dispatch({
    type: 'SET_FORM_VALID_ACTION',
    valid
  })
}