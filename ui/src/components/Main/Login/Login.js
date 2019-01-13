import React from "react";
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import GoogleSignInButton from '../../Utils/GoogleSignInButton/GoogleSignInButton.js';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 4,
  },
  loginGrid: {
    marginTop: 50,
    marginBottom: 50
  },
  loginButton: {
    padding: '0px 15px !important',
    marginTop: 50
  },
  forgotPassword: {
  }
});

class Login extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={24}>
              <Grid item className={classes.loginGrid} lg={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h4" gutterBottom={true} color="secondary">
                    Login with Google
                  </Typography>
                  <GoogleSignInButton 
                    className={classes.loginButton}
                    setCurrentUser={this.props.setCurrentUser} />
                  {this.props.currentUser && 
                    <Redirect
                        to={{
                          pathname: "/private/dashboard"
                        }}
                      />
                  }
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currentUser: state.user.user
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));