import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import _ from 'lodash';

import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import MailIcon from '@material-ui/icons/Email';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import { logInPassword } from './../../../store/actions/auth';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import Spinner from './../Spinner/Spinner';
import createLoadingSelector from './../../../utils/api/selectors';

class Login extends Component {
    state = {
        email: '',
        password: '',
        showPassword: false,
        fetching: false,
        completed: false,
        emailresonse: 'Enter your e-mail',
        pasresponse: 'Enter your password'
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const key = target.id;
        this.setState({
            [key]: value
        });
    }

    handleVisibility = () => {
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

    disabled = () => {
        const { password, email } = this.state;
        if(password.length < 6) {
            return true;
        }
        else if(email.length < 3 || !email.includes('@')) {
            return true;
        }
        else {
            return false;
        }
    }

    timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    failed = () => {
        return this.setState({fetching: false, passwordred: 'Email or password was incorrect'});
    }

    handleLogin = async (logIn) => {
        const { email, password } = this.state;
        if (email && password) {
                this.setState({fetching: true});
                await this.props.logInPassword( email, password );
                await this.timeout(3000);
                const user = firebase.auth().currentUser;
                if(!user) {
                    this.setState({fetching: false, pasresponse: "Email or password was incorrect"});
                } 
        }
    }

    renderLoginForm = () => {
        const { email, password, showPassword, emailresonse, pasresponse } = this.state;
        return(
            <div>
                <div style={styles.inputField}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        variant="outlined"
                        label="E-mail"
                        value={email}
                        type="email"
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: 
                                <InputAdornment position="start">
                                    <IconButton>
                                    <MailIcon fontSize='default'/>
                                    </IconButton>
                                </InputAdornment>,
                        }}
                        helperText={emailresonse}
                    />
                </div>
                <div style={styles.inputField}>
                <TextField
                        required
                        fullWidth
                        id="password"
                        variant="outlined"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: 
                              <InputAdornment position="start">
                                <IconButton aria-label="Toggle password visibility" onClick={this.handleVisibility}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                          }}
                          helperText={pasresponse}
                    />
                </div>
                <div>
                    <IconLabelButtons type="Sign in" action={this.handleLogin} disabled={this.disabled()}/>
                </div>
            </div>
        )
    }

    render() {
        const { isAuthenticated } = this.props;
        const { fetching } = this.state;
        return(
            <div style={styles.container}>
                <Card style={styles.card} raised>
                    <h1>Sign in</h1>
                    {this.renderLoginForm()}
                    {fetching? <Spinner/> : 
                    <Link to="/register" style={styles.link}><div style={styles.text}>Don't have an account? Sign up!</div></Link> }
                    {isAuthenticated ? <Redirect to='/'/> : ''}
                <CardActionArea style={styles.actionArea}>
                        <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                </CardActionArea>
                </Card>
            </div>
        );
    }
}

 const styles = {
    card: {
        maxWidth: 400,
        margin: 'auto',
        height: 600
    },
    actionArea: {
        maxWidth: 400,
        margin: 'auto'
    },
    container: {
        padding: 10
    },
    inputField: {
        width: '80%',
        margin: 'auto',
        padding: 10,
    },
    link: {
        color: 'dodgerblue',
        textDecoration: 'none'
    },
    text: {
        padding: 50,
    },
    media: {
        height: 150,
        width: 200,
        margin: 'auto'
      },
}

const loadingSelector = createLoadingSelector(['LOGIN_PASSWORD', 'AUTHENTICATE']);

const mapStateToProps = state => ({ fetching: loadingSelector(state), isAuthenticated: !_.isEmpty(state.auth.user) });

export default connect( mapStateToProps, { logInPassword } )( Login );