import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send'
import MessageIcon from '@material-ui/icons/Message';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

function IconLabelButtons(props) {
  const { classes, type, action, disabled } = props;
  switch(type){
    case 'Send':
      return (
        <Button variant="contained" color="secondary" className={classes.button} onClick={action} disabled={disabled}>
          Send
          <SendIcon className={classes.rightIcon} />
        </Button>
      );
    case 'Sign in':
      return (
        <Button variant="contained" color="secondary" className={classes.button} onClick={action} disabled={disabled}>
          Sign in
          <SendIcon className={classes.rightIcon} />
        </Button>
      );
    case 'Avbryt':
      return(
        <Button variant="contained" color="primary" className={classes.button} onClick={action}>
          Avbryt
          <DeleteIcon className={classes.rightIcon} />
        </Button>
      );
    case 'Message':
      return (
        <Button variant="contained" color="secondary" className={classes.button} onClick={action} disabled={disabled}>
          New code
          <MessageIcon className={classes.rightIcon} />
        </Button>
      );
    default:
      return(
        <Button variant="contained" color="secondary" className={classes.button} onClick={action} disabled={disabled}>
          {type}
        </Button>
      );
  }
}

IconLabelButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconLabelButtons);