import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import * as api from '../../../lib/api';
import AlertDialog from '../../Utils/AlertDialog/AlertDialog.js';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { showProgressAction, hideProgressAction, showAlertAction, hideAlertAction } from '../../../actions/displayActions';
import { setVideosAction } from '../../../actions/videosActions';

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
    this.props.setVideosAction(null);
  }

  fetchVideos = async () => {
    try {
      this.props.showProgressAction();
      const response = await api.fetchVideos();
      if (this._isMounted) {
        this.props.hideProgressAction();
        this.props.setVideosAction(response.videos);
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.props.hideProgressAction();
        this.props.showAlertAction(error.message);
      }
      return;
    }
  }
   
  onDialogClose = () => {
    this.props.hideAlertAction();
  }

  componentDidMount = async () => {
    console.log('Dashboard didMount');
    this._isMounted = true;
    this.props.hideProgressAction();
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
          {this.props.display.inProgress &&
            <Grid item xs={12}>
              <CircularProgress className={classes.progress} size={25} />
            </Grid>
          }
        </Grid>
        {this.props.videos && !this.props.display.inProgress && this.props.currentUser &&
          <Grid container spacing={24}>
            {this.props.videos.map(item => 
              <Grid item sm={4} key={item.id}>
                {item.thumbnail &&
                  <Button color="inherit" component={Link} to={`/private/videos/${item.id}`} className={classes.videoButton}>
                    <img alt='' src={item.thumbnail} className={classes.videoImg}/>
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
          open={this.props.display.alertOpen} 
          title='Request failed'
          description={this.props.display.error ? this.props.display.error : 'Login failed, please try again.'}
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

const mapStateToProps = state => ({
  currentUser: state.user.user,
  display: state.display,
  videos: state.videos.videos
});
const mapDispatchToProps = dispatch => ({
  showProgressAction: () => dispatch(showProgressAction()),
  hideProgressAction: () => dispatch(hideProgressAction()),
  showAlertAction: (error) => dispatch(showAlertAction(error)),
  hideAlertAction: () => dispatch(hideAlertAction()),
  setVideosAction: (videos) => dispatch(setVideosAction(videos))
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));