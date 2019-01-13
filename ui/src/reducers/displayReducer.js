export default (state = {}, action) => {
  switch (action.type) {
  case 'TOGGLE_DRAWER_ACTION':
    return {
      ...state,
      drawerOpen: !state.drawerOpen
    }
  case 'SHOW_PROGRESS_ACTION':
    return {
      ...state,
      inProgress: true
    }
  case 'HIDE_PROGRESS_ACTION':
    return {
      ...state,
      inProgress: false
    }
  case 'SHOW_ALERT_ACTION':
    return {
      ...state,
      alertOpen: true,
      error: action.error
    }
  case 'HIDE_ALERT_ACTION':
    return {
      ...state,
      alertOpen: false,
      error: ''
    }
  default:
    return state;
  }
}