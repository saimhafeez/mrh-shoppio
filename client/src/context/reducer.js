import {
    SHOW_ALERT,
    CLEAR_ALERT,
    USER_LOGIN_BEGIN,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_ERROR,
} from './actions'

// import { initialState } from "./appContext";

const reducer = (state, action) => {

    if (action.type == SHOW_ALERT) {
        return {
            ...state,
            showAlert: 'true',
            alertStatus: action.payload.alertStatus,
            alertText: action.payload.alertText
        }
    }

    if (action.type == CLEAR_ALERT) {
        return {
            ...state,
            showAlert: 'false',
            alertStatus: '',
            alertText: ''
        }
    }

    // Handle User Login
    if (action.type === USER_LOGIN_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === USER_LOGIN_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            user: action.payload.user,
            token: action.payload.token,
            showAlert: true,
            alertStatus: 'success',
            alertText: action.payload.msg
        }
    }
    if (action.type === USER_LOGIN_ERROR) {
        console.log(action.payload.msg);
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'error',
            alertText: action.payload.msg
        }
    }

    throw new Error(`no such action: ${action.type}`)
}

export default reducer