import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';
import AlertDialog from '../AlertDialog/AlertDialog.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as api from '../../../lib/api';
import { connect } from 'react-redux';
import { showProgressAction, hideProgressAction, showAlertAction, hideAlertAction } from '../../../actions/displayActions';

const styles = {
  root: {
    textAlign: 'center'
  },
};

class GoogleSignInButton extends React.Component {

  onSuccess = async (response) => {
    console.log('onSuccess');
    console.log(JSON.stringify(response, null, 3));
    // Complete the login flow.
    try {
      this.props.showProgressAction();
      const loginResponse = await api.login(response.tokenId);
      this.props.hideProgressAction();
      this.props.setCurrentUser(loginResponse.user);
    } catch (error) {
      console.error(error);
      this.props.hideProgressAction();
      this.props.showAlertAction(error.message);
    }
  }

  onFailure = (response) => {
    console.log('onFailure');
    console.log(JSON.stringify(response, null, 3));
    if (response.error && response.error !== 'popup_closed_by_user') {
      this.props.showAlertAction(null);
    }
  }
   
  onDialogClose = () => {
    this.props.hideAlertAction();
  }

  componentDidMount = async () => {
    this.props.hideProgressAction();
    this.props.hideAlertAction();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.props.display.inProgress &&
          <CircularProgress className={classes.progress} size={50} />
        }
        {!this.props.display.inProgress &&
          <GoogleLogin
            clientId={process.env.REACT_APP_GAPI_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.onSuccess}
            onFailure={this.onFailure}
            className={this.props.className}
          />
        }
        <AlertDialog
          open={this.props.display.alertOpen} 
          title='Login failed'
          description={this.props.display.error ? this.props.display.error : 'Login failed, please try again.'}
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

const mapStateToProps = state => ({
  currentUser: state.user.user,
  display: state.display
});
const mapDispatchToProps = dispatch => ({
  showProgressAction: () => dispatch(showProgressAction()),
  hideProgressAction: () => dispatch(hideProgressAction()),
  showAlertAction: (error) => dispatch(showAlertAction(error)),
  hideAlertAction: () => dispatch(hideAlertAction())
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GoogleSignInButton));