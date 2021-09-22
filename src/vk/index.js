import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import { store } from "../index";
import { setColorScheme } from "./../store/data/actions";
import { router, PAGE_MAIN } from "../router/routers";

import Icon16ErrorCircleFill from "@vkontakte/icons/dist/16/error_circle_fill";
import Icon28UserCircleFillBlue from "@vkontakte/icons/dist/28/user_circle_fill_blue";
import React from "react";
import showSnackbar from "../services/generateSnackbar";

const api = new VKMiniAppAPI();

const STORAGE_KEYS = {
  STATUS: "status",
};

export const initApp = () => api.initApp();

api.onUpdateConfig((res) => {
  if (res?.scheme) store.dispatch(setColorScheme(res.scheme));
});

export const notifications = (snack, callback) => {
  store.getState().data.notifications
    ? api.bridge
        .send("VKWebAppDenyNotifications")
        .then((res) => {
          store.dispatch({
            type: "SET_NOTIFICATIONS",
            payload: { data: false },
          });
          tapticNotification("success");
          store.dispatch({
            type: "SET_SNACKBAR",
            payload: { data: snack("disabled") },
          });
          callback();
        })
        .catch((err) => {
          callback();
        })
    : api.bridge
        .send("VKWebAppAllowNotifications")
        .then((res) => {
          store.dispatch({
            type: "SET_SNACKBAR",
            payload: { data: snack("enabled") },
          });
          tapticNotification("success");
          store.dispatch({
            type: "SET_NOTIFICATIONS",
            payload: { data: true },
          });
          callback();
        })
        .catch(() => {
          tapticNotification("error");
          store.dispatch({
            type: "SET_SNACKBAR",
            payload: { data: snack("error") },
          });
          callback();
        });
};

export const getUserInfo = () => {
  return api.getUserInfo();
};

export const tapticNotification = (type) => {
  api.bridge.send("VKWebAppTapticNotificationOccurred", { type });
};

export const tapticSelectNotification = () => {
  api.bridge.send("VKWebAppTapticSelectionChanged", {});
};

export const getAdd = (ad_format) => {
  api.bridge
    .send("VKWebAppShowNativeAds", { ad_format })
    .then((res) => {
      store.dispatch({
        type: "SET_ADD",
        payload: {
          data: res.data,
        },
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

export const joinCommunity = () => {
  api
    .joinCommunity(200035810)
    .then(() => {
      tapticNotification("success");
      store.dispatch({
        type: "SET_SNACKBAR",
        payload: {
          data: showSnackbar(
            <Icon28UserCircleFillBlue width={24} height={24} />,
            "Вы подписаны на сообщество",
            store.dispatch({ type: "SET_SNACKBAR", payload: { data: null } }),
          ),
        },
      });
    })
    .catch((err) => {
      tapticNotification("error");

      store.dispatch({
        type: "SET_SNACKBAR",
        payload: {
          data: showSnackbar(
            <Icon16ErrorCircleFill width={24} height={24} />,
            "Произошла ошибка",
            store.dispatch({ type: "SET_SNACKBAR", payload: { data: null } }),
          ),
        },
      });
    });
};

export const isIntroViewed = async () => {
  return await api.storageGet(STORAGE_KEYS.STATUS);
};
export const setIntroViewed = async () => {
  api
    .storageSet(STORAGE_KEYS.STATUS, "ye")
    .finally(() => router.replacePage(PAGE_MAIN));
};
