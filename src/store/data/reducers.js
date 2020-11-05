import { SET_COLOR_SCHEME, SET_PROFILE } from './actionTypes';

const initialState = {
	colorScheme: 'client_light',
	profile: {},
};

export const dataReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_COLOR_SCHEME: {
			return {
				...state,
				colorScheme: action.payload.data,
			};
		}
		case SET_PROFILE: {
			console.log(action.payload.data);
			return {
				...state,
				profile: action.payload.data,
			};
		}
		default: {
			return state;
		}
	}
};
