import { SET_COLOR_SCHEME, SET_PROFILE } from './actionTypes.js';
import { getUserInfo } from '../../vk/index';

export const setColorScheme = (inputData) => ({
	type: SET_COLOR_SCHEME,
	payload: {
		data: inputData,
	},
});

export const getProfile = () => async (dispatch) => {
	await getUserInfo()
		.then((data) => {
			
			dispatch({ type: SET_PROFILE, data });
		})
		.catch((err) => {});
};
