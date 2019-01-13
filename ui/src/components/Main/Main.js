import React from "react";
import NoMatch from "./NoMatch/NoMatch";
import { Switch, Route, withRouter } from 'react-router'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PrivateRoute from "../Utils/PrivateRoute/PrivateRoute";
import Home from "./Home/Home";
import About from "./About/About";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Video from "./Video/Video";
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 12,
    padding: theme.spacing.unit * 3,
  },
});


class Main extends React.Component {

  shouldComponentUpdate = (prevProps, prevState) => {
    return prevProps.drawerOpen === this.props.drawerOpen ||
      prevProps.location.pathname !== this.props.location.pathname;
  }

  componentDidMount = async () => {
    console.log('Main didMount');
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/login" component={()=><Login setCurrentUser={this.props.setCurrentUser}/>}/>
          <PrivateRoute exact path="/private/dashboard" component={()=>
            <Dashboard 
              setCurrentUser={this.props.setCurrentUser}
            />
          } currentUser={this.props.currentUser}/>
          <PrivateRoute exact path="/private/videos/:id?" component={()=>
            <Video
              setCurrentUser={this.props.setCurrentUser}
            />
          } currentUser={this.props.currentUser}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    )
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.user.user,
  drawerOpen: state.display.drawerOpen
});
const mapDispatchToProps = dispatch => ({
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main)));