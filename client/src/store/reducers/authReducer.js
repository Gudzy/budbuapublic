import { authTypes } from "../types";

export default (state, action) => {
    switch (action.type) {
        case authTypes.LOGIN_REQUEST:
            return Object.assign({}, state, {
                fetching: true,
                error: false,
            })
        case authTypes.LOGIN_FULFILLED:
            return Object.assign({},state,{
                user: action.payload,
                fetching: false,
                error: false,
            })
        case authTypes.LOGIN_REJECTED:
            return Object.assign({},state,{
                user: null,
                fetching: false,
                error: true,
            })
            case authTypes.LOGIN_PASSWORD_REQUEST:
            return Object.assign({},state,{
                fetching: true,
                error: false,
            })
        case authTypes.LOGIN_PASSWORD_FULFILLED:
            return Object.assign({},state,{
                user: action.payload,
                fetching: false,
                error: false,
            })
        case authTypes.LOGIN_PASSWORD_REJECTED:
            return Object.assign({},state,{
                user: null,
                fetching: false,
                error: true,
            })
        case authTypes.AUTHENTICATE:
            return Object.assign({},state,{
                fetching: true,
                error: false,
            })
        case authTypes.AUTHENTICATE_FULFILLED:
            return Object.assign({},state,{
                user: action.payload,
                fetching: false,
                error: false,
            })
        case authTypes.AUTHENTICATE_REJECTED:
            return Object.assign({},state,{
                user: null,
                fetching: false,
                error: true,
            })
        case authTypes.LOGOUT:
            return Object.assign({},state,{
                user: null,
                fetching: false,
                error: false,
            })
        default:
            return Object.assign({},state)
    }
}