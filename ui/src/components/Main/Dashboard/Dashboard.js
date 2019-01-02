import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import * as api from '../../lib/api';
import AlertDialog from '../../Utils/AlertDialog/AlertDialog.js';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
    flexGrow: 1,
  },
  videoButton: {},
  newButtonGrid: {
    textAlign: 'right'
  },
  videoImg: {
    width: '100%'
  }
};

class Dashboard extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      _inProgress: false,
      _alertOpen: false,
      videos: null
    };
  }

  fetchVideos = async () => {
    try {
      this.setState({_inProgress: true});
      const response = await api.fetchVideos();
      if (this._isMounted) {
        this.setState({
          _inProgress: false,
          videos: response.videos
        });
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          _inProgress: false,
          _error: error.message,
          _alertOpen: true
        });
      }
      return;
    }
  }
   
  onDialogClose = () => {
    this.setState({_alertOpen: false});
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await this.fetchVideos();
  }
  
  componentWillUnmount = () => {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Typography variant="h2">Dashboard</Typography>
          </Grid>
          <Grid item className={classes.newButtonGrid} xs={6}>
            <Button variant="contained" color="inherit" component={Link} to='/private/videos' className={classes.videoButton}>New Video</Button>
          </Grid>
          {this.state._inProgress &&
            <Grid item xs={12}>
              <CircularProgress className={classes.progress} size={25} />
            </Grid>
          }
        </Grid>
        {this.state.videos && !this.state._inProgress && this.props.currentUser &&
          <Grid container spacing={24}>
            {this.state.videos.map(item => 
              <Grid item sm={4} key={item.id}>
                {item.thumbnail &&
                  <Button color="inherit" component={Link} to={`/private/videos/${item.id}`} className={classes.videoButton}>
                    <img src={item.thumbnail} className={classes.videoImg}/>
                  </Button>
                }
                {!item.thumbnail &&
                  <div>
                    <Typography variant="body1">{item.title}</Typography>
                    <Button color="inherit" component={Link} to={`/private/videos/${item.id}`} className={classes.videoButton}>
                      Edit
                    </Button>
                  </div>
                }
              </Grid>
            )}
          </Grid>
        }
        <AlertDialog
          open={this.state._alertOpen} 
          title='Request failed'
          description={this.state._error ? this.state._error : 'Login failed, please try again.'}
          handlePositive={this.onDialogClose}
          handleClose={this.onDialogClose}
          positiveButton='Close'
        />
      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);