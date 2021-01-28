import axios from '../api/interceptor';
import storage from './storage';
export const saveCredentials = (res) => {
    try {
        localStorage.setItem('user_rc', res.data.token);
    } catch {
        window.token = res.data.token;
    }

    axios.defaults.headers.common['Authorization'] = res.data.token;
};
