import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import HelpIcon from '@material-ui/icons/Help';
import MailOutlined from '@material-ui/icons/MailOutlined';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';


const message1 = "Send oss gjerne en mail på kundeservice@budbua.no."
const message2 = "BudBua er et online auksjonshus for eksterne selgere og kjøpere."

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class Footer extends React.Component {
  state = {
    open: false,
    Transition: null,
    message: message1
  }

  handleClick1 = Transition => () => {
    this.setState({ open: true, message: message1, Transition});
  }

  handleClick2 = Transition => () => {
    this.setState({ open: true, message: message2, Transition});
  }

  handleClose = () => {
    this.setState({open: false });
  }

  render () {
    const { classes } = this.props;
    return (
    <div>
      <AppBar position="fixed" color="secondary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div style={{alignItems: 'center', justifyContent: 'center'}}>
            <div>
              <IconButton color="inherit" onClick={this.handleClick1(TransitionUp)}>
              <MailOutlined />
              </IconButton>
            </div>
          </div>
          <div style={{alignItems: 'center', justifyContent: 'center'}}>
            <div>Gruppe 68 - Budbua AS</div>
          </div>
          <div style = {{alignItems: 'center', justifyContent: 'center'}}>
            <IconButton color="inherit" onClick={this.handleClick2(TransitionUp)}>
            <HelpIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Snackbar
        bodyStyle ={styles.container}
        open={this.state.open}
        onClose={this.handleClose}
        TransitionComponent={this.state.Transition}
        bodyStyle={{background: '#777777'}}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message = {<span id="message-id" className={styles.message}>{this.state.message}</span>}
        action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
        ]}/>
    </div>
    );
  }
}

const styles = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    position: 'fixed',
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactCard: {
    maxWidth: 650,
    margin: 'auto',
    height: 100,
    textAlign:'center'
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'secondary',
  },
});

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
