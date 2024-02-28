import axios from 'axios'
import store from '../store'
import { setToken } from '../store/appSlice';

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        store.dispatch(setToken(token))
        localStorage.setItem('token', token)
    } else {
        delete axios.defaults.headers.common['Authorization']
        store.dispatch(setToken(null))
        localStorage.removeItem('token')
    }
}

export default setAuthToken;