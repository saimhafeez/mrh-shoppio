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
} from "./actions";

import reducer from "./reducer";


const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const cart = localStorage.getItem('cart');

const initialState = {
    user: user ? JSON.parse(user) : null,
    token: token,
    showAlert: false,
    alertText: '',
    alertStatus: '',
    roleOptions: ['customer', 'vendor'],
    isLoading: false,
    cart: cart ? JSON.parse(cart) : []
}


const AppContext = React.createContext();

const AppProvider = (({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);


    // Using Axios Interceptors
    // to distinguish between 400 (Bad Request) and 401 (Authorization) errors.

    const authFetch = axios.create({
        baseURL: '/api/v1',
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

    const removeCartFromLocalStorage = (productId, cart) => {
        var cartProducts = []
        if (cart !== null) {
            for (const item of cart) {
                if (item.productId === productId) {
                    if (item.quantity !== 1) {
                        cartProducts.push({
                            ...item,
                            quantity: item.quantity - 1
                        })
                    } else {
                        dispatch({
                            type: SHOW_ALERT,
                            payload: {
                                showAlert: true,
                                alertStatus: 'info',
                                alertText: 'Product Removed From Cart'
                            }
                        })
                    }
                } else {
                    cartProducts.push(item)
                }
            }
        }
        dispatch({
            type: UPDATE_CART,
            payload: {
                cart: cartProducts
            }
        })
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }

    const addCartToLocalStorage = (cartProduct, cart) => {
        const cartProducts = []

        var flag = false

        if (cart !== null) {

            for (const item of cart) {

                if (item.productId === cartProduct.productId) {
                    cartProducts.push({
                        ...item,
                        quantity: item.quantity + 1
                    })
                    flag = true
                } else {
                    cartProducts.push(item)
                }
            }
        }

        if (!flag) {
            cartProducts.push(cartProduct)

            dispatch({
                type: SHOW_ALERT,
                payload: {
                    showAlert: true,
                    alertStatus: 'info',
                    alertText: 'Product Added to Cart'
                }
            })
        }
        dispatch({
            type: UPDATE_CART,
            payload: {
                cart: cartProducts
            }
        })
        localStorage.setItem('cart', JSON.stringify(cartProducts));
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
        let url = `/vendor/products`

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
            const data = await authFetch.post('vendor/uploadImage', formData)
            dispatch({ type: VENDOR_IMAGES_UPLOAD_SUCCESS, payload: { msg: 'Images Uploaded!' } });
            return data;
        } catch (error) {

            dispatch({ type: VENDOR_IMAGES_UPLOAD_ERROR, payload: { msg: error.response.data.msg } });
        }

    }

    const createProduct = async ({ name, description, price, stock, images, categories, tags }) => {

        dispatch({ type: VENDOR_CREATE_PRODUCT_BEGIN });

        try {

            await authFetch.post('vendor/product', {
                name,
                description,
                price,
                stock,
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

    const getCategories = async () => {

        try {

            const { data } = await axios.get('/api/v1/site/categories')

            const { categories } = await data;

            return { categories };

        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: error.response.data.msg
                }
            });
        }
    }

    const getTags = async () => {

        try {

            const { data } = await axios.get('/api/v1/site/tags')

            const { tags } = await data;

            return { tags };

        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: error.response.data.msg
                }
            });
        }
    }

    const getAllProducts = async (query) => {
        try {

            const { data } = await axios.get(`/api/v1/site/shop/${query}`)

            const {

                products,
                totalProducts,
                numOfPages

            } = await data;

            return { products, totalProducts, numOfPages };

        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: error.response.data.msg
                }
            });
        }
    }

    const getSingleProduct = async (productID) => {
        try {
            const { data } = await axios.get(`/api/v1/site/shop/${productID}`)
            const { product } = await data;
            return product;
        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: error.response.data
                }
            });
        }
    }

    const submitReview = async (review) => {

        try {
            const { data } = await axios.post('/api/v1/site/review', review)
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'success',
                    alertText: 'Thanks for submitting a Review'
                }
            });
            const { productReview } = await data
            return productReview
        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: `Unable to Submit Your Review (${error})`
                }
            });
        }
    }

    const getProductReviews = async (productID) => {
        try {
            const { data } = await axios.get(`/api/v1/site/review/${productID}`)
            return data

        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: `Error in fetching Reviews (${error})`
                }
            });
        }
    }

    const getWishList = async () => {

        const { user } = state;
        let url = `/customer/wishlist?customerID=${user._id}`
        try {
            const { data } = await authFetch(url)
            const { products, count } = await data;
            return { products, count };
        } catch (error) {
            console.log(error);
            // logoutUser()
        }
    }

    const addToWishList = async (productID) => {
        let url = `/customer/wishlist?productID=${productID}`
        const { user } = state
        url += `&customerID=${user._id}`
        try {
            dispatch({ type: ADD_TO_WISHLIST_BEGIN })
            const { data } = await authFetch.post(url)
            dispatch({ type: ADD_TO_WISHLIST_SUCCESS })
        } catch (error) {
            dispatch({
                type: ADD_TO_WISHLIST_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
    }

    const removeFromWishList = async (productID) => {
        let url = `/customer/wishlist?productID=${productID}`
        const { user } = state
        url += `&customerID=${user._id}`
        try {
            dispatch({ type: REMOVE_FROM_WISHLIST_BEGIN })
            const { data } = await authFetch.delete(url)
            dispatch({ type: REMOVE_FROM_WISHLIST_SUCCESS })
        } catch (error) {
            dispatch({
                type: REMOVE_FROM_WISHLIST_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
    }

    const isInWishlist = async (productID) => {
        const { user } = state
        let url = `/customer/wishlist/${productID}?customerID=${user._id}`
        try {
            const { data } = await authFetch(url)
            const result = await data;
            return result
        } catch (error) {
            console.log(error)
        }
    }

    const submitOrder = async ({
        cart,
        customerID,
        shippingAddress
    }) => {
        dispatch({
            type: SUBMIT_ORDER_BEGIN
        })
        try {

            const { data } = await axios.post('/api/v1/site/order', {
                cart,
                customerID,
                shippingAddress
            });

            const { orders, ordersCount } = await data;

            return { orders, ordersCount };

        } catch (error) {
            console.log(error)
        }
    }

    const getVendorOrders = async (vendorId) => {
        try {

            const { data } = await authFetch(`/vendor/orders?vendorId=${vendorId}`)

            const { orders } = await data

            return { orders }

        } catch (error) {

        }
    }

    const updateOrderStatus = async (orderID, orderStatus) => {
        try {
            const { data } = await authFetch.post(`/vendor/order/${orderID}`, { orderStatus });
            const { updatedOrder } = await data
            return { updatedOrder }

        } catch (error) {
            dispatch({
                type: SHOW_ALERT,
                payload: {
                    alertStatus: 'error',
                    alertText: error.response.data.msg
                }
            })
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
        getCategories,
        getTags,
        getAllProducts,
        getSingleProduct,
        submitReview,
        getProductReviews,
        getWishList,
        addToWishList,
        removeFromWishList,
        isInWishlist,
        addCartToLocalStorage,
        removeCartFromLocalStorage,
        submitOrder,
        getVendorOrders,
        updateOrderStatus,
    }}>
        {children}
    </AppContext.Provider>

})

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }