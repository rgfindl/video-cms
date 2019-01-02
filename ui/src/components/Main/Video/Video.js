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
import * as api from '../../lib/api';
import AlertDialog from '../../Utils/AlertDialog/AlertDialog.js';
import { withRouter, Redirect } from "react-router";
import ReactPlayer from 'react-player'
import _ from 'lodash';

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
  constructor(props) {
    super(props);
    this.state = {
      _inProgress: false,
      _deleteProgress: false,
      _saveProgress: false,
      _saveComplete: false,
      _deleteComplete: false,
      _uploadProgress: false,
      _error: false,
      _alertOpen: false,
      _deleteConfirmation: false,
      _formErrors: {title: '', description: '', url: ''},
      _titleValid: false,
      _titleChanged: false,
      _descriptionValid: false,
      _descriptionChanged: false,
      _urlValid: false,
      _urlChanged: false,
      _formValid: false,
      title: "",
      description: "",
      url: ""
    };
  }

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
          this.setState({ _uploadProgress: true });
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
          this.setState({ _uploadProgress: false });
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
          this.setState({
            url: result.body.location,
            _uploadProgress: false
          });
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
      this.setState({
        _saveProgress: true
      });
      let response = null;
      if (!this.state.id) {
        console.log('save');
        const video = _.omitBy(this.state, (value, key) => _.startsWith(key, '_'));
        response = await api.saveVideo(video);
        _saveComplete = true;
      } else {
        console.log('update');
        const video = _.omitBy(this.state, (value, key) => _.startsWith(key, '_'));
        response = await api.updateVideo(video);
      }
      if (this._isMounted) {
        // Update state.
        this.setState(_.assign({}, response.video, {
          _saveProgress: false,
          _saveComplete
        }));
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          _saveProgress: false,
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

  openDeleteConfirmation = () => {
    this.setState({_deleteConfirmation: true});
  }

  closeDeleteConfirmation = () => {
    this.setState({_deleteConfirmation: false});
  }

  deleteVideo = async () => {
    this.closeDeleteConfirmation();
    try {
      this.setState({ _deleteProgress: true });
      await api.deleteVideo(this.state.id);
      if (this._isMounted) {
        this.setState({_deleteProgress: false, _deleteComplete: true });
      }
      return;
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          _deleteProgress: false,
          _error: error.message,
          _alertOpen: true
        });
      }
      return;
    }
  }

  fetchVideo = async (id) => {
    try {
      this.setState({ _inProgress: true });
      const response = await api.fetchVideo(id);
      if (this._isMounted) {
        if (response.video) {
          this.setState(_.assign({}, response.video, {_inProgress: false }));
          this.validateField('title', this.state.title);
          this.validateField('description', this.state.description);
          this.validateField('url', this.state.url);
        } else {
          this.setState({
            _inProgress: false,
            _error: 'Video not found',
            _alertOpen: true
          });
        }
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

  componentDidMount = async () => {
    console.log('video did mount');
    this._isMounted = true;
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
    this.setState({[name]: value}, 
      () => { this.validateField(name, value) });
  }

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state._formErrors;
    let titleValid = this.state._titleValid;
    let descriptionValid = this.state._descriptionValid;
    let urlValid = this.state._urlValid;
  
    switch(fieldName) {
      case 'title':
        titleValid = value.length >= 1;
        fieldValidationErrors.title = titleValid ? '': 'title is required';
        this.setState({_titleChanged: true});
        break;
      case 'description':
        descriptionValid = value.length >= 1;
        fieldValidationErrors.description = descriptionValid ? '': 'description is required';
        this.setState({_descriptionChanged: true});
        break;
      case 'url':
        urlValid = value.length >= 1;
        fieldValidationErrors.url = urlValid ? '': 'url is required';
        this.setState({_urlChanged: true});
        break;
      default:
        break;
    }
    this.setState({
      _formErrors: fieldValidationErrors,
      _titleValid: titleValid,
      _descriptionValid: descriptionValid,
      _urlValid: urlValid
    }, this.validateForm);
  }
  
  validateForm = () => {
    this.setState({_formValid: this.state._titleValid && this.state._descriptionValid && this.state._urlValid});
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
                  {this.state._inProgress &&
                    <CircularProgress className={classes.progress} size={25} />
                  }
                  {!this.state._inProgress &&
                    <div>
                      {this.state.status &&
                        <Typography variant="body1" gutterBottom={true} color="secondary">
                          Status: <span className={classes.status}>{this.state.status}</span>
                        </Typography>
                      }
                      <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        fullWidth
                        value={this.state.title}
                        onChange={this.handleUserInput}
                        helperText={this.state._formErrors.title}
                        error={this.state._titleChanged && !this.state._titleValid}
                      />
                      <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        value={this.state.description}
                        onChange={this.handleUserInput}
                        helperText={this.state._formErrors.description}
                        error={this.state._descriptionChanged && !this.state._descriptionValid}
                      />
                      <TextField
                        margin="dense"
                        id="url"
                        name="url"
                        label="Video URL"
                        fullWidth
                        value={this.state.url}
                        onChange={this.handleUserInput}
                        helperText={this.state._formErrors.url}
                        error={this.state._urlChanged && !this.state._urlValid}
                      />
                      <Grid item lg={12}>
                        <div id="FileInput" className={this.state._uploadProgress || this.state._saveProgress || this.state._deleteProgress ? classes.uploadButtonDisabled : classes.uploadButton}></div>
                        {this.state._uploadProgress &&
                          <CircularProgress className={classes.uploadProgress} size={25} />
                        }
                        {this.state.url &&
                          <ReactPlayer 
                            url={this.state.url} 
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
                      {this.state.streams &&
                        <div>
                          <Grid item lg={12} className={classes.streamGrid}>
                              <Typography variant='body1'>External API</Typography>
                              <a href={`${process.env.REACT_APP_EXTERNAL_API_HOST}/videos?id=${this.state.id}`}>{`${process.env.REACT_APP_EXTERNAL_API_HOST}/videos?id=${this.state.id}`}</a>
                          </Grid>
                          {this.state.streams.map(stream => 
                            <Grid item lg={12} key={stream.url} className={classes.streamGrid}>
                              <Typography>{stream.type} - {stream.width} x {stream.height}</Typography>
                              <a href={stream.url}>{stream.url}</a>
                            </Grid>
                          )}
                        </div>
                      }
                      <Grid container spacing={24}>
                        <Grid item className={classes.deleteButtonGrid} lg={6}>
                          {!this.state._deleteProgress &&
                            <Button onClick={this.openDeleteConfirmation} disabled={this.state._uploadProgress || this.state._saveProgress || !this.state.id} color="secondary" size="large" variant="contained" className={classes.deleteButton} >
                              Delete
                            </Button>
                          }
                          {this.state._deleteProgress &&
                            <CircularProgress className={classes.progress} size={25} />
                          }
                          <AlertDialog
                            open={this.state._deleteConfirmation} 
                            title='Delete video?'
                            description='Are you sure you want to delete this video?'
                            handlePositive={this.deleteVideo}
                            handleNegative={this.closeDeleteConfirmation}
                            handleClose={this.closeDeleteConfirmation}
                            positiveButton='Delete'
                            negativeButton='Close'
                          />
                          {this.state._deleteComplete &&
                            <Redirect
                                to={{
                                  pathname: `/private/dashboard`
                                }}
                              />
                          }
                        </Grid>
                        <Grid item className={classes.saveButtonGrid} lg={6}>
                          {!this.state._saveProgress &&
                            <Button onClick={this.updateVideo} disabled={this.state._uploadProgress || this.state._deleteProgress || !this.state._formValid} color="primary" size="large" variant="contained" className={classes.saveButton} >
                              Save
                            </Button>
                          }
                          {this.state._saveProgress &&
                            <CircularProgress className={classes.progress} size={25} />
                          }
                        </Grid>
                      </Grid>
                      {this.state._saveComplete &&
                        <Redirect
                            to={{
                              pathname: `/private/videos/${this.state.id}`
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

Video.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Video));