import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppBar from'../AppBar/AppBar'
import Drawer from'../Drawer/Drawer'
import Main from'../Main/Main'
import Footer from'../Footer/Footer'
import {omit, isEqual} from 'lodash';
import blue from '@material-ui/core/colors/blue';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as api from '../../lib/api';
import { connect } from 'react-redux';
import { setUserAction } from '../../actions/userActions';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: blue
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.setUserAction(sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null);
    api.init(process.env.REACT_APP_API_HOST, this.setCurrentUser);
  }

  setCurrentUser = (currentUser) => {
    console.log('onSuccess');
    if (isEqual(this.props.currentUser, currentUser)) return;
    console.log('onSuccess2');
    this.props.setUserAction(currentUser ? omit(currentUser, 'token') : currentUser);
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.setItem('currentUserToken', currentUser.token);
    } else {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUserToken');
    }
  }

  componentDidMount = async () => {
    console.log('App didMount');
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <AppBar
              setCurrentUser={this.setCurrentUser}
            />
            <Drawer
              setCurrentUser={this.setCurrentUser} 
            />
            <Main
              setCurrentUser={this.setCurrentUser}
            />
            <Footer/>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.user
});
const mapDispatchToProps = dispatch => ({
  setUserAction: (user) => dispatch(setUserAction(user))
});
export default connect(mapStateToProps, mapDispatchToProps)(App);