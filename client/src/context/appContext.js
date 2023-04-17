import React, { useContext, useReducer } from "react";
import axios from 'axios'

import {
    SHOW_ALERT,
    CLEAR_ALERT,
    USER_LOGIN_BEGIN,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_ERROR,
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

    const loginUser = async ({ currentUser }) => {
        dispatch({ type: USER_LOGIN_BEGIN });
        try {

            const { data } = await axios.post('/api/v1/auth/login', currentUser);

            const { user, token } = data;
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    user,
                    token,
                    msg: 'login successful!'
                }
            })

            // save to local storage if remember me is ticked

        } catch (error) {
            dispatch({
                type: USER_LOGIN_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
    }

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        clearAlert,
        loginUser,
    }}>
        {children}
    </AppContext.Provider>

})

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, initialState, useAppContext }