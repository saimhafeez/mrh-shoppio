import {
    SHOW_ALERT,
    CLEAR_ALERT,
    LOGOUT_USER,
    USER_LOGIN_BEGIN,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_ERROR,
    VENDOR_CREATE_PRODUCT_BEGIN,
    VENDOR_CREATE_PRODUCT_SUCCESS,
    VENDOR_CREATE_PRODUCT_ERROR,
    VENDOR_IMAGES_UPLOAD_BEGIN,
    VENDOR_IMAGES_UPLOAD_SUCCESS,
    VENDOR_IMAGES_UPLOAD_ERROR,
    GET_PRODUCTS_BEGIN,
    GET_PRODUCTS_SUCCESS,
} from './actions'

import { initialState } from "./appContext";

const reducer = (state, action) => {

    if (action.type == LOGOUT_USER) {
        return {
            ...initialState,
            user: null,
            token: null,
            showAlert: 'true',
            alertStatus: 'info',
            alertText: 'User Logged Out'
        }
    }

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


    // GET PRODUCTS
    if (action.type === GET_PRODUCTS_BEGIN) {
        return ({
            ...state,
            isLoading: true,
        })
    }
    if (action.type === GET_PRODUCTS_SUCCESS) {
        return ({
            ...state,
            isLoading: false,
        })
    }

    // VENDOR --> PRODUCT
    if (action.type === VENDOR_CREATE_PRODUCT_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === VENDOR_CREATE_PRODUCT_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'success',
            alertText: action.payload.msg
        }
    }
    if (action.type === VENDOR_CREATE_PRODUCT_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'error',
            alertText: action.payload.msg
        }
    }

    // VENDOR --> PRODUCT IMAGES UPLOAD
    if (action.type === VENDOR_IMAGES_UPLOAD_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === VENDOR_IMAGES_UPLOAD_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'success',
            alertText: action.payload.msg
        }
    }
    if (action.type === VENDOR_IMAGES_UPLOAD_ERROR) {
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