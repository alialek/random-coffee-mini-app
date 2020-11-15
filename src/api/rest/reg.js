import axios from '../interceptor';

export const register = (about) => {
	return axios.post('reg', { about });
};

export const updateAbout = (about) => {
	return axios.put('reg', { about });
};
