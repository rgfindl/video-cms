import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Uppy from '@uppy/core';
import FileInput from '@uppy/file-input';
import ProgressBar from '@uppy/progress-bar';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import '@uppy/core/dist/style.css'
import '@uppy/file-input/dist/style.css'
import '@uppy/progress-bar/dist/style.css'
import * as api from '../../../lib/api';
import AlertDialog from '../../Utils/AlertDialog/AlertDialog.js';
import { withRouter, Redirect } from "react-router";
import ReactPlayer from 'react-player'
import { connect } from 'react-redux';
import { showProgressAction, hideProgressAction, showAlertAction, hideAlertAction } from '../../../actions/displayActions';
import * as videoActions from '../../../actions/videoActions';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2
  },
  loginGrid: {
    marginTop: 50,
    marginBottom: 50
  },
  saveButton: {
    marginTop: 25
  },
  deleteButton: {
    marginTop: 25
  },
  forgotPassword: {
  },
  saveButtonGrid: {
    textAlign: 'right'
  },
  deleteButtonGrid: {
    textAlign: 'left'
  },
  uploadButton: {
    marginTop: 25
  },
  uploadButtonDisabled: {
    marginTop: 25,
    '& button': {
      pointerEvents: 'none'
    }
  },
  uploadProgress: {
    marginTop: 25
  },
  progress: {
    marginTop: 25
  },
  status: {
    textTransform: 'uppercase'
  },
  streamGrid: {
    marginTop: 20
  }
});

class Video extends React.Component {
  _isMounted = false;

  initUppy = () => {
    const uppy = new Uppy({ debug: true, autoProceed: true });
    uppy.use(FileInput, {
      target: '#FileInput',
      pretty: true,
      inputName: 'files[]',
      locale: {
        strings: {
          chooseFiles: 'Upload Video'
        }
      }
    });
    uppy.use(AwsS3Multipart, {
      limit: 4,
      createMultipartUpload: async (file) => {
        console.log('createMultipartUpload');
        console.log(file);
        if (this._isMounted) {
          this.props.showUploadProgressAction();
        }
        const result = await api.createMultipartUpload(file);
        return result.body;
      },
      listParts: async (file, { uploadId, key }) => {
        console.log('listParts');
        console.log(file);
        console.log(uploadId);
        console.log(key);
        const result = await api.listMultipartUploadParts(file, { uploadId, key });
        return result.body;
      },
      prepareUploadPart: async (file, partData) => {
        console.log('prepareUploadPart');
        console.log(file);
        console.log(partData);
        const result = await api.prepareMultipartUploadPart(file, partData);
        return result.body;
      },
      abortMultipartUpload: async (file, { uploadId, key }) => {
        console.log('abortMultipartUpload');
        console.log(file);
        console.log(uploadId);
        console.log(key);
        const result = await api.abortMultipartUpload(file, { uploadId, key });
        if (this._isMounted) {
          this.props.hideUploadProgressAction();
        }
        return result.body;
      },
      completeMultipartUpload: async (file, { uploadId, key, parts }) => {
        console.log('completeMultipartUpload');
        console.log(file);
        console.log(uploadId);
        console.log(key);
        console.log(parts);
        const result = await api.completeMultipartUpload(file, { uploadId, key, parts });
        console.log(JSON.stringify(result, null, 3));
        if (this._isMounted) {
          this.props.updateVideoAction({
            url: result.body.location
          });
          this.props.hideUploadProgressAction();
          this.validateField('url', result.body.location);
        }
        return result.body;
      }
    });
    uppy.use(ProgressBar, {
      target: '#ProgressBar',
      fixed: false,
      hideAfterFinish: true
    });
  }

  updateVideo = async () => {
    let _saveComplete = false;
    try {
      this.props.showSaveProgressAction();
      let response = null;
      if (!this.props.videoForm.video.id) {
        console.log('save');
        response = await api.saveVideo(this.props.videoForm.video);
        _saveComplete = true;
      } else {
        console.log('update');
        response = await api.updateVideo(this.props.videoForm.video);
      }
      if (this._isMounted) {
        // Update state.
        this.props.updateVideoAction(response.video);
        this.props.saveCompleteAction(_saveComplete);
        this.props.hideSaveProgressAction();
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.props.hideSaveProgressAction();
        this.props.showAlertAction(error.message);
      }
      return;
    }
  }
   
  onDialogClose = () => {
    this.props.hideAlertAction();
  }

  openDeleteConfirmation = () => {
    this.props.deleteConfirmationAction(true);
  }

  closeDeleteConfirmation = () => {
    this.props.deleteConfirmationAction(false);
  }

  deleteVideo = async () => {
    this.closeDeleteConfirmation();
    try {
      this.props.showDeleteProgressAction();
      await api.deleteVideo(this.props.videoForm.video.id);
      if (this._isMounted) {
        this.props.deleteCompleteAction(true);
        this.props.hideDeleteProgressAction();
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.props.hideDeleteProgressAction();
        this.props.showAlertAction(error.message);
      }
      return;
    }
  }

  fetchVideo = async (id) => {
    try {
      this.props.showProgressAction();
      const response = await api.fetchVideo(id);
      if (this._isMounted) {
        if (response.video) {
          this.props.updateVideoAction(response.video);
          this.props.hideProgressAction();
          this.validateField('title', this.props.videoForm.video.title);
          this.validateField('description', this.props.videoForm.video.description);
          this.validateField('url', this.props.videoForm.video.url);
        } else {
          this.props.hideProgressAction();
          this.props.showAlertAction('Video not found');
        }
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

  componentDidMount = async () => {
    console.log('video did mount');
    this._isMounted = true;

    this.props.hideProgressAction();
    this.props.hideUploadProgressAction();
    this.props.hideSaveProgressAction();
    this.props.hideDeleteProgressAction();
    this.props.saveCompleteAction(false);
    this.props.deleteCompleteAction(false);
    this.props.deleteConfirmationAction(false);
    this.props.setFieldChangedAction('titleChanged', false);
    this.props.setFieldChangedAction('descriptionChanged', false);
    this.props.setFieldChangedAction('urlChanged', false);
    this.props.setFieldValidAction('titleValid', false);
    this.props.setFieldValidAction('descriptionValid', false);
    this.props.setFieldValidAction('urlValid', false);
    this.props.setFormErrorsAction({
      title: '', 
      description: '', 
      url: ''
    });
    this.props.setFormValidAction(false);

    if (this.props.match.params.id) {
      await this.fetchVideo(this.props.match.params.id);
    }
    if (this._isMounted) {
      this.initUppy();
    }
  }
  
  componentWillUnmount = () => {
    this._isMounted = false;
  }
  
  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.props.setVideoInputAction(name, value);
    this.validateField(name, value);
  }

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.props.videoForm.formErrors;
    let titleValid = this.props.videoForm.titleValid;
    let descriptionValid = this.props.videoForm.descriptionValid;
    let urlValid = this.props.videoForm.urlValid;
  
    switch(fieldName) {
      case 'title':
        titleValid = value.length >= 1;
        fieldValidationErrors.title = titleValid ? '': 'title is required';
        this.props.setFieldChangedAction('titleChanged', true);
        break;
      case 'description':
        descriptionValid = value.length >= 1;
        fieldValidationErrors.description = descriptionValid ? '': 'description is required';
        this.props.setFieldChangedAction('descriptionChanged', true);
        break;
      case 'url':
        urlValid = value.length >= 1;
        fieldValidationErrors.url = urlValid ? '': 'url is required';
        this.props.setFieldChangedAction('urlChanged', true);
        break;
      default:
        break;
    }
    this.props.setFormErrorsAction(fieldValidationErrors);
    this.props.setFieldValidAction('titleValid', titleValid);
    this.props.setFieldValidAction('descriptionValid', descriptionValid);
    this.props.setFieldValidAction('urlValid', urlValid);
    this.props.setFormValidAction(
      this.props.videoForm.titleValid && this.props.videoForm.descriptionValid && this.props.videoForm.urlValid);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={24}>
              <Grid item className={classes.loginGrid} lg={6}>
                <Paper className={classes.paper}>
                  <Typography variant="h3" gutterBottom={true} color="secondary">
                    Video
                  </Typography>
                  {this.props.display.inProgress &&
                    <CircularProgress className={classes.progress} size={25} />
                  }
                  {!this.props.display.inProgress &&
                    <div>
                      {this.props.videoForm.video.status &&
                        <Typography variant="body1" gutterBottom={true} color="secondary">
                          Status: <span className={classes.status}>{this.props.videoForm.video.status}</span>
                        </Typography>
                      }
                      <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        fullWidth
                        value={this.props.videoForm.video.title}
                        onChange={this.handleUserInput}
                        helperText={this.props.videoForm.formErrors.title}
                        error={this.props.videoForm.titleChanged && !this.props.videoForm.titleValid}
                      />
                      <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        value={this.props.videoForm.video.description}
                        onChange={this.handleUserInput}
                        helperText={this.props.videoForm.formErrors.description}
                        error={this.props.videoForm.descriptionChanged && !this.props.videoForm.descriptionValid}
                      />
                      <TextField
                        margin="dense"
                        id="url"
                        name="url"
                        label="Video URL"
                        fullWidth
                        value={this.props.videoForm.video.url}
                        onChange={this.handleUserInput}
                        helperText={this.props.videoForm.formErrors.url}
                        error={this.props.videoForm.urlChanged && !this.props.videoForm.urlValid}
                      />
                      <Grid item lg={12}>
                        <div id="FileInput" className={this.props.videoForm.uploadProgress || this.props.videoForm.saveProgress || this.props.videoForm.deleteProgress ? classes.uploadButtonDisabled : classes.uploadButton}></div>
                        {this.props.videoForm.uploadProgress &&
                          <CircularProgress className={classes.uploadProgress} size={25} />
                        }
                        {this.props.videoForm.video.url &&
                          <ReactPlayer 
                            url={this.props.videoForm.video.url} 
                            controls={true}
                            playing={false}
                            width='inherit'
                            height='inherit'
                            style={{
                              marginTop: 25
                            }}
                          />
                        }
                      </Grid>
                      <Grid item lg={12}>
                        <div id="ProgressBar"></div>
                      </Grid>
                      {this.props.videoForm.video.streams &&
                        <div>
                          <Grid item lg={12} className={classes.streamGrid}>
                              <Typography variant='body1'>External API</Typography>
                              <a href={`${process.env.REACT_APP_EXTERNAL_API_HOST}/videos?id=${this.props.videoForm.video.id}`}>{`${process.env.REACT_APP_EXTERNAL_API_HOST}/videos?id=${this.props.videoForm.video.id}`}</a>
                          </Grid>
                          {this.props.videoForm.video.streams.map(stream => 
                            <Grid item lg={12} key={stream.url} className={classes.streamGrid}>
                              <Typography>{stream.type} - {stream.width} x {stream.height}</Typography>
                              <a href={stream.url}>{stream.url}</a>
                            </Grid>
                          )}
                        </div>
                      }
                      <Grid container spacing={24}>
                        <Grid item className={classes.deleteButtonGrid} lg={6}>
                          {!this.props.videoForm.deleteProgress &&
                            <Button onClick={this.openDeleteConfirmation} disabled={this.props.videoForm.uploadProgress || this.props.videoForm.saveProgress || !this.props.videoForm.video.id} color="secondary" size="large" variant="contained" className={classes.deleteButton} >
                              Delete
                            </Button>
                          }
                          {this.props.videoForm.deleteProgress &&
                            <CircularProgress className={classes.progress} size={25} />
                          }
                          <AlertDialog
                            open={this.props.videoForm.deleteConfirmation} 
                            title='Delete video?'
                            description='Are you sure you want to delete this video?'
                            handlePositive={this.deleteVideo}
                            handleNegative={this.closeDeleteConfirmation}
                            handleClose={this.closeDeleteConfirmation}
                            positiveButton='Delete'
                            negativeButton='Close'
                          />
                          {this.props.videoForm.deleteComplete &&
                            <Redirect
                                to={{
                                  pathname: `/private/dashboard`
                                }}
                              />
                          }
                        </Grid>
                        <Grid item className={classes.saveButtonGrid} lg={6}>
                          {!this.props.videoForm.saveProgress &&
                            <Button onClick={this.updateVideo} disabled={this.props.videoForm.uploadProgress || this.props.videoForm.deleteProgress || !this.props.videoForm.formValid} color="primary" size="large" variant="contained" className={classes.saveButton} >
                              Save
                            </Button>
                          }
                          {this.props.videoForm.saveProgress &&
                            <CircularProgress className={classes.progress} size={25} />
                          }
                        </Grid>
                      </Grid>
                      {this.props.videoForm.saveComplete &&
                        <Redirect
                            to={{
                              pathname: `/private/videos/${this.props.videoForm.video.id}`
                            }}
                          />
                      }
                    </div>
                  }
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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

Video.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  currentUser: state.user.user,
  display: state.display,
  videoForm: state.videoForm
});
const mapDispatchToProps = dispatch => ({
  showProgressAction: () => dispatch(showProgressAction()),
  hideProgressAction: () => dispatch(hideProgressAction()),
  showAlertAction: (error) => dispatch(showAlertAction(error)),
  hideAlertAction: () => dispatch(hideAlertAction()),
  showUploadProgressAction: () => dispatch(videoActions.showUploadProgressAction()),
  hideUploadProgressAction: () => dispatch(videoActions.hideUploadProgressAction()),
  showSaveProgressAction: () => dispatch(videoActions.showSaveProgressAction()),
  hideSaveProgressAction: () => dispatch(videoActions.hideSaveProgressAction()),
  showDeleteProgressAction: () => dispatch(videoActions.showDeleteProgressAction()),
  hideDeleteProgressAction: () => dispatch(videoActions.hideDeleteProgressAction()),
  saveCompleteAction: (complete) => dispatch(videoActions.saveCompleteAction(complete)),
  deleteCompleteAction: (complete) => dispatch(videoActions.deleteCompleteAction(complete)),
  deleteConfirmationAction: (confirmation) => dispatch(videoActions.deleteConfirmationAction(confirmation)),
  updateVideoAction: (video) => dispatch(videoActions.updateVideoAction(video)),
  setVideoInputAction: (key, value) => dispatch(videoActions.setVideoInputAction(key, value)),
  setFieldValidAction: (field, valid) => dispatch(videoActions.setFieldValidAction(field, valid)),
  setFieldChangedAction: (field, changed) => dispatch(videoActions.setFieldChangedAction(field, changed)),
  setFormErrorsAction: (formErrors) => dispatch(videoActions.setFormErrorsAction(formErrors)),
  setFormValidAction: (valid) => dispatch(videoActions.setFormValidAction(valid))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Video)));