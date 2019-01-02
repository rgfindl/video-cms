import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppBar from'../AppBar/AppBar'
import Drawer from'../Drawer/Drawer'
import Main from'../Main/Main'
import Footer from'../Footer/Footer'
import {omit, isEqual} from 'lodash';
import blue from '@material-ui/core/colors/blue';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as api from '../lib/api';

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
    this.state = {
      _drawerOpen: false,
      currentUser: sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null
    };
    api.init(process.env.REACT_APP_API_HOST, this.setCurrentUser);
  }

  closeDrawer = () => {
    this.setState({_drawerOpen: false});
  };

  openDrawer = () => {
    this.setState({_drawerOpen: true});
  };

  toggleDrawer = () => {
    this.setState((prevState) => {
      return {_drawerOpen: !prevState._drawerOpen}
    });
  };

  setCurrentUser = (currentUser) => {
    if (isEqual(this.state.currentUser, currentUser)) return;
    this.setState({ currentUser: currentUser ? omit(currentUser, 'token') : currentUser });
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.setItem('currentUserToken', currentUser.token);
    } else {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUserToken');
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <AppBar 
              toggleDrawer={this.toggleDrawer}
              currentUser={this.state.currentUser}
              setCurrentUser={this.setCurrentUser}
            />
            <Drawer
              open={this.state._drawerOpen}
              closeDrawer={this.closeDrawer}
              openDrawer={this.openDrawer}
              currentUser={this.state.currentUser}
              setCurrentUser={this.setCurrentUser} 
            />
            <Main
              currentUser={this.state.currentUser}
              setCurrentUser={this.setCurrentUser}
              drawerOpen={this.state._drawerOpen}
            />
            <Footer/>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default App;