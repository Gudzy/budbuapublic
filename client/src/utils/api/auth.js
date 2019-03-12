import axios from "axios";
import firebase from 'firebase';

import { getToken, setToken } from "../localStorage";
import CLOUD_URL from './../../url';

const logIn = async (phone, code) => {
    try {
        let { data } = await axios.post(CLOUD_URL + 'verifyOneTimePassword', {
            phone: phone, code: code
        });
        if(data){
            await firebase.auth().signInWithCustomToken(data.token);
            return firebase.auth().currentUser;
        }    
    } catch(err) {
    }
}

const logInPassword = async (email, password) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            setToken(btoa([email,password].join(":")));
            window.location.replace('/');
        }).catch(function(error) {
        });
        return firebase.auth().currentUser;
    } catch(err) {
    }
}

// This function is for basic authentication only
const authenticate = async (token = null, currentUser = null) => {
    token = getToken();
    currentUser = firebase.auth().currentUser;
    if(currentUser){
        return currentUser;
    } else {
        if(token) {
            try {
                    const authString = atob(token);
                    const auth = authString.split(":");
                    await firebase.auth().signInWithEmailAndPassword(auth[0], auth[1]).then(function() {
                    }).catch(function(error) {
                    });
                    return firebase.auth().currentUser; 
            } catch(err) {
            }
        } return null;
    }
}

const logOut = async () => {
    try {
        await firebase.auth().signOut().then(function() {
            setToken(null);
            window.location.replace('/');
        }, function(error) {
        });
        return null;
    } catch(err) {
    }
}

export default {
    logIn,
    logInPassword,
    authenticate,
    logOut,
}