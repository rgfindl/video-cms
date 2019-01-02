import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import logo from '../../../resources/images/logo/logo-AppStore.png'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  logo: {
    maxWidth: 250,
    marginBottom: 25
  },
  headlineGrid: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  },
  headline: {
    color: theme.palette.primary.main,
  },
  loginButton: {}
});


class Home extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={24}>
              <Grid item className={classes.headlineGrid} xs={12}>
                <img className={classes.logo} src={logo} alt="Logo" />
                <Typography variant="h2" align="center" className={classes.headline} gutterBottom={true}>
                  Blue
                </Typography>
                <Typography variant="h4" align="center" color="secondary" gutterBottom={true}>
                  Open Source Video CMS
                </Typography>
                {!this.props.currentUser &&
                  <Button variant="contained" size="large" color="primary" component={Link} to="/login" className={classes.loginButton}>Login</Button>
                }
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={24}>
              <Grid item md={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom={true}>
                    Serverless
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Highly scalable, low cost, and maintenance free.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item md={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom={true}>
                    React.js &amp; Node.js
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Popular combination of React.js and Node.js.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item md={4}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" gutterBottom={true}>
                    Infrastructure as Code
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Repeatable and reliable IaC via CloudFormation.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);