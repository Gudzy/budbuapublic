import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { authenticate } from "./../../../store/actions/auth";

class Profile extends Component{
    render(){
        const { isAuthenticated } = this.props;
        return(
            <div>
                Profile
                {isAuthenticated ? '' : <Redirect to='/login' />}
            </div>
        );
    }
 }

 const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
})

export default connect( mapStateToProps, { authenticate } )( Profile );