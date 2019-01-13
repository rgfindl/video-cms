export const setUserAction = (user) => dispatch => {
  dispatch({
    type: 'SET_USER_ACTION',
    user
  })
}