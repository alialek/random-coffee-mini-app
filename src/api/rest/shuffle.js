import axios from '../interceptor';

export const shuffle = () => {
    return axios('shuffle');
};
