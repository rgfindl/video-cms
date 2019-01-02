import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import HelpIcon from '@material-ui/icons/Help';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class MyDrawer extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SwipeableDrawer
          open={this.props.open}
          onClose={this.props.closeDrawer}
          onOpen={this.props.openDrawer}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.closeDrawer}
            onKeyDown={this.props.closeDrawer}
          >
            <div className={classes.list}>
              <List>
                <ListItem button component={Link} to={this.props.currentUser ? '/private/dashboard' : '/'}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/about">
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItem>
              </List>
              <Divider/>
              <List>
                <ListItem button component={Link} to="/private/dashboard">
                  <ListItemIcon>
                    <VideoLibraryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Videos" />
                </ListItem>
                <ListItem button component={Link} to="/private/videos">
                  <ListItemIcon>
                    <VideoCallIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Video" />
                </ListItem>
              </List>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

MyDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  openDrawer: PropTypes.func.isRequired,
};

export default withStyles(styles)(MyDrawer);