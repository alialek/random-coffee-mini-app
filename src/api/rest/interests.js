import axios from '../interceptor';

export const updateInterests = (interests) => {
	return axios.put('/interests', { interests});
};
