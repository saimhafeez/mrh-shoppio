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
    ADD_TO_WISHLIST_BEGIN,
    ADD_TO_WISHLIST_SUCCESS,
    ADD_TO_WISHLIST_ERROR,
    REMOVE_FROM_WISHLIST_BEGIN,
    REMOVE_FROM_WISHLIST_SUCCESS,
    REMOVE_FROM_WISHLIST_ERROR,
    UPDATE_CART,
    SUBMIT_ORDER_BEGIN,
    SUBMIT_ORDER_SUCCESS,
    SUBMIT_ORDER_ERROR,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    CLEAR_CART,
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
    if (action.type === ADD_TO_WISHLIST_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === ADD_TO_WISHLIST_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'success',
            alertText: 'Product added to your Wishlist'
        }
    }
    if (action.type === ADD_TO_WISHLIST_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'error',
            alertText: `Error adding product to wishlist [${action.payload.msg}]`
        }
    }
    if (action.type === REMOVE_FROM_WISHLIST_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === REMOVE_FROM_WISHLIST_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'success',
            alertText: 'Product removed from your Wishlist'
        }
    }
    if (action.type === REMOVE_FROM_WISHLIST_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'error',
            alertText: `Error removing product from wishlist [${action.payload.msg}]`
        }
    }
    if (action.type === UPDATE_CART) {

        // console.log('reducer cart ', action.payload.cart)

        return {
            ...state,
            cart: action.payload.cart
        }
    }
    if (action.type === CLEAR_CART) {
        return {
            ...state,
            cart: []
        }
    }

    if (action.type === SUBMIT_ORDER_BEGIN) {
        return {
            ...state
        }
    }

    if (action.type === UPDATE_USER_BEGIN) {
        return {
            ...state,
            isLoading: true
        }
    }
    if (action.type === UPDATE_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            [state.user.profileUrl]: action.payload.profileUrl || state.user.profileUrl,
            [state.user.name]: action.payload.profileUrl || state.user.name,
            [state.user.email]: action.payload.email || state.user.email,
            showAlert: true,
            alertStatus: 'success',
            alertText: 'Changes Saved'
        }
    }
    if (action.type === UPDATE_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertStatus: 'error',
            alertText: `Unable to save changes, ${action.payload.msg}`

        }
    }

    throw new Error(`no such action: ${action.type}`)
}

export default reducer