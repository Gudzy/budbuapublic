import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from 'firebase/app';

import { authenticate } from './store/actions/auth';
import AppBar from './ui/components/AppBar/AppBar';
import menuRoutes from './routes';
import './App.css';
import firebaseConfig from './firebaseConfig';

class App extends Component {
  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    this.props.authenticate();
  }

  render() {
    let { isAuthenticated } = this.props;
    return (
      <Router>
        <div className="App">
          <AppBar/>
            {menuRoutes.map(route => (
              <div key={route.path}>
                <Route exact={route.exact} path={route.path} render={() => route.component} />
                {route.subroute && (
                  <Route exact={route.subroute.exact} path={route.subroute.path} render={(...props) => route.subroute.component} />
                )}
              </div>
            ))}
            
            {isAuthenticated ? 'Online' : 'Offline'}
        </div>
  
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !_.isEmpty(state.auth.user),
})

export default connect( mapStateToProps, { authenticate } )( App );