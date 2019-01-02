import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class NoMatch extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <h2>NoMatch</h2>
      </div>
    )
  }
}

NoMatch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoMatch);