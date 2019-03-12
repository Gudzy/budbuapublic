import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  fabSuccess: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

class CircularIntegration extends Component {
    render() {
        const { success, loading, action } = this.props;

        return (
            <div style={styles.root}>
                <div >
                    <Fab color="primary" style={loading ? styles.fabProgress : styles.fabSuccess} onClick={action}>
                    {success ? <CheckIcon /> : <SaveIcon />}
                    </Fab>
                    {loading && <CircularProgress size={68} style={styles.fabProgress} />}
                </div>
                <div >
                    <Button
                    variant="contained"
                    color="primary"
                    style={loading ? styles.buttonProgress : styles.buttonSuccess}
                    disabled={loading}
                    onClick={action}
                    >
                    Accept terms
                    </Button>
                    {loading && <CircularProgress size={24} style={styles.buttonProgress} />}
                </div>
            </div>
        );
    }
}

export default CircularIntegration;