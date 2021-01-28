import {
    SET_COLOR_SCHEME,
    SET_PROFILE,
    SET_ABOUT,
    SET_NOTIFICATIONS,
    SET_PARTICIPANT_INFO,
    SET_SNACKBAR,
    SET_INTERESTS,
    SET_ADD,
} from './actionTypes';

const initialState = {
    colorScheme: 'client_light',
    defaultInterests: [
        'IT',
        'медиа',
        'здоровье',
        'общественная деятельность',
        'бизнес',
        'наука',
        'саморазвитие',
        'политика',
        'экология',
        'книги',
        'спорт',
        'путешествия',
    ],
    profile: {},
    about: '',
    participantInfo: null,
    notifications: false,
    snackbar: null,
    interests: [],
    add: {},
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
        case SET_ADD: {
            return {
                ...state,
                add: action.payload.data,
            };
        }
        case SET_INTERESTS: {
            if (action.payload.data instanceof Array) {
                return {
                    ...state,
                    interests: action.payload.data,
                };
            } else {
                return {
                    ...state,
                    interests: state.interests.includes(action.payload.data)
                        ? state.interests.filter((interest) => interest !== action.payload.data)
                        : [...state.interests, action.payload.data],
                };
            }
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
