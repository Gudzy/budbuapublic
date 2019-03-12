import React from 'react';

import MarketIcon from '@material-ui/icons/Shop';
import AccountIcon from '@material-ui/icons/AccountCircle';
import RegisterIcon from '@material-ui/icons/PersonAdd';

import Market from './ui/components/Market/Market';
import Login from './ui/components/Login/Login';
import Register from './ui/components/Register/Register';
import Profile from './ui/components/Profile/Profile';
import Product from './ui/components/Market/Product';

const menuRoutes = [
    {
        name: 'Market',
        path: '/',
        component: <Market/>,
        exact: true,
        icon: <MarketIcon />,
        subroute: {
            name: 'Product',
            path: '/market/:id',
            component: <Product/>,
            exact: false,
        }
    },
    {
        name: 'Login',
        path: '/login',
        component: <Login/>,
        exact: false,
        icon: <AccountIcon />,
    },
    {
        name: 'Profile',
        path: '/profile',
        component: <Profile/>,
        exact: false,
        icon: <AccountIcon/>,
    },
    {
        name: 'Register',
        path: '/register',
        component: <Register/>,
        exact: false,
        icon: <RegisterIcon />,
    },
];


export default menuRoutes;
