import axios from '../interceptor';

export const complain = (id) => {
    return axios.post('complain', { id });
};
