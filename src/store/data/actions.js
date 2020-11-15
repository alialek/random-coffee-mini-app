import { SET_COLOR_SCHEME, SET_PROFILE, SET_ABOUT, SET_NOTIFICATIONS, SET_PARTICIPANT_INFO } from './actionTypes.js';
import { getUserInfo } from '../../vk/index';

export const setColorScheme = (inputData) => ({
    type: SET_COLOR_SCHEME,
    payload: {
        data: inputData,
    },
});

export const getProfile = (data) => ({
    type: SET_PROFILE,
    payload: {
        data: data,
    },
});

export const setAbout = (inputData) => ({
    type: SET_ABOUT,
    payload: {
        data: inputData,
    },
});

export const setNotifications = (inputData) => ({
    type: SET_NOTIFICATIONS,
    payload: {
        data: inputData,
    },
});

export const setParticipantInfo = (inputData) => ({
    type: SET_PARTICIPANT_INFO,
    payload: {
        data: inputData,
    },
});
