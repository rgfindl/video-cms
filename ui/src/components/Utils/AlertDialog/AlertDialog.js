import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  root: {
  },
};

class AlertDialog extends React.Component {

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {this.props.negativeButton &&
              <Button onClick={this.props.handleNegative} color="primary">
                {this.props.negativeButton}
              </Button>
            }
            {this.props.positiveButton &&
              <Button onClick={this.props.handlePositive} color="primary" autoFocus>
                {this.props.positiveButton}
              </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  positiveButton: PropTypes.string.isRequired,
  handlePositive: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(AlertDialog);