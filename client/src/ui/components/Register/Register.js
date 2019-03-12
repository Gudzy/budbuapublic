import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import MailIcon from '@material-ui/icons/Email';
import DialIcon from '@material-ui/icons/Dialpad';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import { logIn } from "./../../../store/actions/auth";
import { authenticate } from './../../../store/actions/auth';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import CLOUD_URL from './../../../url';
import Spinner from './../Spinner/Spinner';

class Register extends Component{
    state = {
        phone: '',
        code: '',
        email: '',
        password: '',
        passwordCheck: '',
        submitted: false,
        completed: false,
        showPassword: false,
        token: '',
        redirect: false,
        fetching: false,
        resphone: "Enter your phone number",
        rescode: "Enter the recieved 4-digit code"
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

    handlePhoneSubmit = async () => {
        const { phone } = this.state;
        this.setState({ submitted: true });
        if (phone) {
            try {
                this.setState({fetching: true});
                try{
                    await axios.post(CLOUD_URL + 'registerUser', {phone});
                    try{
                        await axios.post(CLOUD_URL + 'requestOneTimePassword', {phone});
                        this.setState({fetching: false, resphone: 'One time code sent'});
                    } catch(err) {
                        this.setState({resphone: 'Failed to send code'});
                    }
                } catch(err) {
                    this.setState({ resphone: 'Phone number already in use', fetching: false});
                }
            } catch (err) {
                this.setState({ resphone: 'Please enter a valid phone number', fetching: false});
            }
        }
    }

    handleCodeSubmit = async () => {
        const { phone, code } = this.state;
        if( phone && code ) {
            this.setState({fetching: true})
            try {
                await firebase.auth().signOut();
                await this.props.logIn(phone,code);
                await this.timeout(3000);
                const user = firebase.auth().currentUser;
                if(user){
                    this.setState({completed: true, fetching: false, response: "Phone registered."}); 
                } else {
                    this.setState({fetching: false, rescode: "Phone or code incorrect"})
                }    
            } catch(err) {
                this.setState({ fetching: false, rescode: "Phone or code incorrect"});
            }   
        }
    }

    handleCredentialsSubmit = async () => {
        const { email, password } = this.state;
        if (email && password) {
            try {
                this.setState({ fetching: true});
                var credential = firebase.auth.EmailAuthProvider.credential(email, password);
                await firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential); 
                this.setState({redirect: true})
            } catch (err) {
                this.setState({ fetching: false, response: "Email already in use"});
                console.log(err);
            }
        }
    }

    timeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderPhoneRegistration = () => {
        const { phone, code, submitted, resphone, rescode } = this.state;
        return(
            <div>
                <div style={styles.inputField}>
                    <TextField
                        required
                        fullWidth
                        id="phone"
                        variant="outlined"
                        label="Phone"
                        type="number"
                        value={phone}
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+47</InputAdornment>,
                        }}
                        helperText={resphone}
                    />
                </div>
                <div>
                        <IconLabelButtons type="Message" action={this.handlePhoneSubmit} disabled={phone.length < 8 || phone.length > 8}/>
                        {submitted && !phone &&
                                    <div>Valid phone number is required</div>
                                }
                </div>
                <div style={styles.inputField}>
                    <TextField
                        required
                        fullWidth
                        id="code"
                        variant="outlined"
                        label="Code"
                        type="number"
                        value={code}
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: 
                                <InputAdornment position="start">
                                    <DialIcon />
                                </InputAdornment>,
                        }}
                        helperText={rescode}
                    />
                </div>
                <div>
                        <IconLabelButtons type="Send" action={this.handleCodeSubmit} disabled={code.length < 4 || code.length > 4 || phone.length < 8 || phone.length > 8}/>
                        {submitted && !phone &&
                                    <div>Valid phone number is required</div>
                                }
                </div>
            </div>
        )

    }

    renderMailPasswordRegistration = () => {
        const { email, password, passwordCheck, showPassword } = this.state;
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
                                    <MailIcon />
                                </InputAdornment>,
                        }}
                        helperText={"Provide your email adress"}
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton aria-label="Toggle password visibility" onClick={this.handleVisibility}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                    />
                </div>
                <div style={styles.inputField}>
                    <TextField
                        required
                        fullWidth
                        id="passwordCheck"
                        variant="outlined"
                        label="Re-enter Password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordCheck}
                        onChange={this.handleChange}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton aria-label="Toggle password visibility" onClick={this.handleVisibility}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        helperText={password !== passwordCheck ? "Password does not match" : "Password matches"}
                    />
                </div>
                <div>
                    <IconLabelButtons type="Complete" action={this.handleCredentialsSubmit} disabled={this.disabled()}/>
                </div>
            </div>
        )
    }

    disabled = () => {
        const { password, passwordCheck, email } = this.state;
        if(password !== passwordCheck || password.length < 6) {
            return true;
        }
        else if(email.length < 3 || !email.includes('@')) {
            return true;
        }
        else {
            return false;
        }
    }
    
    render() {
        const { completed, redirect, fetching } = this.state;
        return(
            <div style={styles.container}>
                <Card style={styles.card} raised>
                    <h1>Sign up</h1>
                        { completed ? this.renderMailPasswordRegistration() : this.renderPhoneRegistration() }
                        { redirect ? <Redirect to='/login' /> : ''}
                    {fetching? <Spinner/> : 
                    <div>
                    <Link to="/login" style={styles.link}><div style={completed ? styles.text : styles.text2}>Already have an account? Sign in!</div></Link>
                    <CardActionArea style={styles.actionArea}>
                    <CardMedia style={completed ? styles.media : styles.media2} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                    </CardActionArea>
                    </div> }
                    
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
        padding: 0,
    },
    text2: {
        padding: 24,
    },
    media: {
        height: 90,
        width: 200,
        margin: 'auto',
    },
    media2: {
        height: 150,
        width: 200,
        margin: 'auto',
    },
}
 
const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
});

export default connect( mapStateToProps, { authenticate, logIn } )( Register );