import { SET_COLOR_SCHEME, SET_PROFILE, SET_ABOUT, SET_NOTIFICATIONS, SET_PARTICIPANT_INFO } from './actionTypes';

const initialState = {
    colorScheme: 'client_light',
    profile: {},
    about: '',
    participantInfo: null,
    notifications: false,
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
            return {
                ...state,
                profile: action.payload.data,
            };
        }
        case SET_ABOUT: {
            return {
                ...state,
                about: action.payload.data,
            };
        }
        case SET_NOTIFICATIONS: {
            console.log(action);
            return {
                ...state,
                notifications: action.payload.data,
            };
        }
        case SET_ABOUT: {
            return {
                ...state,
                about: action.payload.data,
            };
        }
        case SET_PARTICIPANT_INFO: {
            return {
                ...state,
                participantInfo: action.payload.data,
            };
        }
        default: {
            return state;
        }
    }
};
