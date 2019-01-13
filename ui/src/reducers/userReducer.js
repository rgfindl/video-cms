export default (state = {}, action) => {
  switch (action.type) {
  case 'SET_USER_ACTION':
    return {
      ...state,
      user: action.user
    }
  default:
    return state;
  }
}