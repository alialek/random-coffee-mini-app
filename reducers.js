import {
    SET_COLOR_SCHEME,
    SET_PROFILE,
    SET_ABOUT,
    SET_NOTIFICATIONS,
    SET_PARTICIPANT_INFO,
    SET_PARTICIPATION_STATUS,
    SET_SNACKBAR,
} from './actionTypes';

const initialState = {
    colorScheme: 'client_light',
    profile: {},
    about: '',
    participantInfo: {
        history: [],
        current: { info: {
                id: 209676123,
                first_name: "Александр",
                last_name: "Ковалёв",
                sex: 2,
                photo_100: "https://sun2.beltelecom-by-minsk.userapi.com/impf/c850020/v850020984/17e1e7/GZAnWyBoHIw.jpg?size=100x0&quality=96&crop=188,72,589,589&sign=004960f6e477c120b87dd574e238506f&ava=1",
                photo_max_orig: "https://sun2.beltelecom-by-minsk.userapi.com/impf/c850020/v850020984/17e1e7/GZAnWyBoHIw.jpg?size=0x0&quality=96&crop=188,72,589,589&sign=ec832280e0388d0d79643fbc1fb58b2a&ava=1",
                bdate: "8.9.1999",
                photo_200: "https://sun2.beltelecom-by-minsk.userapi.com/impf/c850020/v850020984/17e1e7/GZAnWyBoHIw.jpg?size=200x0&quality=96&crop=188,72,589,589&sign=dcf08db902a9d9c6c64cdc868f62413d&ava=1",
                timezone: 3,
            }
        }
    },
    participationStatus: false,
    notifications: false,
    snackbar: null,
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
        case SET_SNACKBAR: {
            return {
                ...state,
                snackbar: action.payload.data,
            };
        }
        case SET_NOTIFICATIONS: {
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
        case SET_PARTICIPATION_STATUS: {
            return {
                ...state,
                participationStatus: action.payload.data,
            };
        }
        default: {
            return state;
        }
    }
};
