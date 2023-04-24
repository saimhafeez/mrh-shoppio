import React, { useContext, useReducer } from 'react';
import axios from 'axios'

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
} from "./actions";

import reducer from "./reducer";


const user = localStorage.getItem('user');
const token = localStorage.getItem('token');

const initialState = {
    user: user ? JSON.parse(user) : null,
    token: token,
    showAlert: false,
    alertText: '',
    alertStatus: '',
    roleOptions: ['customer', 'vendor'],
    isLoading: false,
}


const AppContext = React.createContext();

const AppProvider = (({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);


    // Using Axios Interceptors
    // to distinguish between 400 (Bad Request) and 401 (Authorization) errors.

    const authFetch = axios.create({
        baseURL: '/api/v1/vendor',
    })

    // Request
    authFetch.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${state.token}`
        console.log('authFetch:', config.headers['Authorization']);
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    // Response
    authFetch.interceptors.response.use((response) => {
        return response
    }, (error) => {
        if (error.response.status === 401) {
            logoutUser()
        }
        return Promise.reject(error)
    })




    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage();
    }

    const displayAlert = ({ alertStatus, alertText }) => {
        dispatch(
            {
                type: SHOW_ALERT,
                payload: { alertText, alertStatus }
            }
        );

    }

    const clearAlert = () => {
        dispatch({ type: CLEAR_ALERT })
    }

    const addUserToLocalStorage = ({ user, token }) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }


    const loginUser = async ({ currentUser }) => {
        dispatch({ type: USER_LOGIN_BEGIN });
        try {

            const { data } = await axios.post('/api/v1/auth/login', currentUser);

            const { user, token, rememberMe } = data;
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    user,
                    token,
                    msg: 'login successful!'
                }
            })

            console.log('rememberMe', rememberMe);

            // save to local storage if remember me is ticked
            if (rememberMe) {
                addUserToLocalStorage({ user, token })
            }

        } catch (error) {
            dispatch({
                type: USER_LOGIN_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
    }


    const getProducts = async ({ page }) => {

        const { user } = state;
        let url = `/products`

        if (user.role == 'vendor') {

            url += `?vendorId=${user._id}`
        }

        console.log(page);

        if (page) {
            url += `&page=${page}`
        }

        dispatch({ type: GET_PRODUCTS_BEGIN })

        try {

            const { data } = await authFetch(url)
            const { products, totalProducts, numOfPages } = await data;

            dispatch({ type: GET_PRODUCTS_SUCCESS })
            return { products, totalProducts, numOfPages };

        } catch (error) {
            console.log(error);
            logoutUser()
        }
    }


    const uploadImagesToServer = async (formData) => {

        dispatch({ type: VENDOR_IMAGES_UPLOAD_BEGIN });

        try {
            const data = await authFetch.post('/uploadImage', formData)
            dispatch({ type: VENDOR_IMAGES_UPLOAD_SUCCESS, payload: { msg: 'Images Uploaded!' } });
            return data;
        } catch (error) {

            dispatch({ type: VENDOR_IMAGES_UPLOAD_ERROR, payload: { msg: error.response.data.msg } });
        }

    }

    const createProduct = async ({ name, description, price, images, categories, tags }) => {

        dispatch({ type: VENDOR_CREATE_PRODUCT_BEGIN });

        try {

            await authFetch.post('/product', {
                name,
                description,
                price,
                images,
                categories,
                tags
            })
            dispatch({
                type: VENDOR_CREATE_PRODUCT_SUCCESS,
                payload: { msg: 'Product Created!' }
            });

        } catch (error) {
            dispatch({
                type: VENDOR_CREATE_PRODUCT_ERROR,
                payload: { msg: error.response.data.msg }
            });
        }

    }

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        logoutUser,
        clearAlert,
        loginUser,
        createProduct,
        uploadImagesToServer,
        getProducts,
    }}>
        {children}
    </AppContext.Provider>

})

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }