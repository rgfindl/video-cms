export const toggleDrawerAction = () => dispatch => {
  dispatch({
    type: 'TOGGLE_DRAWER_ACTION'
  })
}

export const showProgressAction = () => dispatch => {
  dispatch({
    type: 'SHOW_PROGRESS_ACTION'
  })
}

export const hideProgressAction = () => dispatch => {
  dispatch({
    type: 'HIDE_PROGRESS_ACTION'
  })
}

export const showAlertAction = (error) => dispatch => {
  dispatch({
    type: 'SHOW_ALERT_ACTION',
    error
  })
}

export const hideAlertAction = () => dispatch => {
  dispatch({
    type: 'HIDE_ALERT_ACTION'
  })
}