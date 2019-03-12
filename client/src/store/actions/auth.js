import { authTypes } from "../types"
import authApi from "../../utils/api/auth"

export const logIn = (phone, code) => ({
    type: authTypes.LOGIN_REQUEST,
    payload: authApi.logIn(phone, code),
});

export const authenticate = () => ({
    type: authTypes.AUTHENTICATE,
    payload: authApi.authenticate(),
});

export const logInPassword = (email, password) => ({
    type: authTypes.LOGIN_PASSWORD_REQUEST,
    payload: authApi.logInPassword(email, password),
});

export const logOut = () => ({
    type: authTypes.LOGOUT,
    payload: authApi.logOut(),
});