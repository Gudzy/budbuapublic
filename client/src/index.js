import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider } from "@material-ui/core/styles"


import store from "./store/index";
import './index.css';
import App from './App.js';
import * as serviceWorker from './serviceWorker';
import theme from "./assets/themes/budbua";


ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline>
                <App />
            </CssBaseline>
        </MuiThemeProvider>
    </Provider>, 

document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
