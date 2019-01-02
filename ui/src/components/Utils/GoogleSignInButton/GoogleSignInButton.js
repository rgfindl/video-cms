import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';
import AlertDialog from '../AlertDialog/AlertDialog.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as api from '../../lib/api';

const styles = {
  root: {
    textAlign: 'center'
  },
};

class GoogleSignInButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _alertOpen: false,
      _inProgress: false
    };
  }

  onSuccess = async (response) => {
    console.log('onSuccess');
    console.log(JSON.stringify(response, null, 3));
    // Complete the login flow.
    try {
      this.setState({_inProgress: true});
      const loginResponse = await api.login(response.tokenId);
      this.setState({_inProgress: false});
      this.props.setCurrentUser(loginResponse.user);
    } catch (error) {
      console.error(error);
      this.setState({
        _inProgress: false,
        error: error.message,
        _alertOpen: true
      });
    }
  }

  onFailure = (response) => {
    console.log('onFailure');
    console.log(JSON.stringify(response, null, 3));
    if (response.error && response.error !== 'popup_closed_by_user') {
      this.setState({_alertOpen: true});
    }
  }
   
  onDialogClose = () => {
    this.setState({_alertOpen: false});
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state._inProgress &&
          <CircularProgress className={classes.progress} size={50} />
        }
        {!this.state._inProgress &&
          <GoogleLogin
            clientId={process.env.REACT_APP_GAPI_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
            className={this.props.className}
          />
        }
        <AlertDialog
          open={this.state._alertOpen} 
          title='Login failed'
          description={this.state.error ? this.state.error : 'Login failed, please try again.'}
          handlePositive={this.onDialogClose}
          handleClose={this.onDialogClose}
          positiveButton='Close'
        />
      </div>
    )
  }
}

GoogleSignInButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GoogleSignInButton);