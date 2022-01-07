import {
    SET_COLOR_SCHEME,
    SET_SNACKBAR,
    SET_PROFILE,
    SET_ABOUT,
    SET_NOTIFICATIONS,
    SET_PARTICIPANT_INFO,
    SET_PARTICIPATION_STATUS,
} from './actionTypes.js';
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

export const setSnackbar = (inputData) => ({
    type: SET_SNACKBAR,
    payload: {
        data: inputData,
    },
});

export const setParticipationStatus = (inputData) => ({
    type: SET_PARTICIPATION_STATUS,
    payload: {
        data: inputData,
    },
});
