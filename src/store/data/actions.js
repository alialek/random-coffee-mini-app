import {
  SET_COLOR_SCHEME,
  SET_SNACKBAR,
  SET_PROFILE,
  SET_ABOUT,
  SET_NOTIFICATIONS,
  SET_PARTICIPANT_INFO,
  SET_INTERESTS,
  SET_ADD,
} from "./actionTypes.js";
import { user } from "./../../api/rest/user";
import { auth } from "./../../api/rest/auth";
import { saveCredentials } from "./../../services/saveCredentials";
import { getUserInfo } from "./../../vk/index";

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

export const setAdd = (data) => ({
  type: SET_ADD,
  payload: {
    data,
  },
});

export const setInterests = (data) => ({
  type: SET_INTERESTS,
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

export const authentication = (authString) => async (dispatch) => {
  const resp = await auth(authString);
  saveCredentials(resp, async () => {
    return dispatch({
      type: SET_INTERESTS,
      payload: {
        data: await getUserInfo(),
      },
    });
  });
};

export const getParticipantInfo = (inputData) => (dispatch) =>
  user()
    .then((res) => {
      dispatch({
        type: SET_PARTICIPANT_INFO,
        payload: {
          data: res.data,
        },
      });
      dispatch({
        type: SET_ABOUT,
        payload: {
          data: res.data.about,
        },
      });
      dispatch({
        type: SET_INTERESTS,
        payload: {
          data: res.data.interests,
        },
      });
    })
    .catch(() =>
      dispatch({
        type: SET_PARTICIPANT_INFO,
        payload: {
          data: "error",
        },
      }),
    );

export const setSnackbar = (inputData) => ({
  type: SET_SNACKBAR,
  payload: {
    data: inputData,
  },
});
