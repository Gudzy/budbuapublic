import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import menuRoutes from '../../../routes';
import { authenticate } from "../../../store/actions/auth";


const styles = {
  list: {
    width: 220,
  },
  fullList: {
    width: 'auto',
  },
  bigAvatar: {
    width: 180,
    height: 100,
  },
};

/**
 * Based on Material UI - Drawer
 */

class NavDrawer extends Component {
  render() {
    const { classes, open, handleDrawer, isAuthenticated } = this.props;
    //Show Profile when signed in, and Login when not in the NavBar.
    let menu = menuRoutes.filter((route) => {
      if(route.name !== 'Login' && route.name !== 'Profile') {
        return true; 
      }
      else if(route.name === 'Login') {
        return !isAuthenticated;
      } 
      else if(route.name === 'Profile') {
        return isAuthenticated;
      } 
      else {
        return true;
      } 
    });

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem >
            <ListItemAvatar >
              <Avatar alt="Budbua" src="https://imgur.com/Lr3KJIl.jpg" className={classes.bigAvatar}/>
            </ListItemAvatar>
          </ListItem>
          <Divider/>
          {menu.map(route => (
            <Link key={route.path} to={route.path}  style={{color: 'white'}} >
            <ListItem button key={route.name}>
            
              <ListItemIcon> 
                  {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
            </Link>
          ))}
        </List>
      </div>
    );

    return (
      <div>
        <Drawer open={open} onClose={handleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.handleDrawer}
            onKeyDown={this.props.handleDrawer}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !_.isEmpty(state.auth.user),
})

export default connect(
  mapStateToProps,
  { 
    authenticate 
  },
)(withStyles(styles)(NavDrawer));
