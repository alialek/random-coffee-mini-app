import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';
import { store } from '../index';
import { setColorScheme } from './../store/data/actions';
import { router, PAGE_MAIN, PAGE_INTRO } from '../router/routers';
import { updateNotifications } from './../api';

const api = new VKMiniAppAPI();

const STORAGE_KEYS = {
    STATUS: 'status',
};

export const initApp = () => api.initApp();

api.onUpdateConfig((res) => {
    console.log(res);
    if (res?.scheme) store.dispatch(setColorScheme(res.scheme));
});

export const notifications = () => {
    store.getState().data.notifications
        ? api.bridge.send('VKWebAppDenyNotifications').then((res) => {
              store.dispatch({ type: 'SET_NOTIFICATIONS', payload: { data: false } });
              router.popPage();
          })
        : api.bridge
              .send('VKWebAppAllowNotifications')
              .then((res) => {
                  store.dispatch({ type: 'SET_NOTIFICATIONS', payload: { data: true } });
                  router.popPage();
              })
              .catch(() => {
                  router.popPage();
              });
};

export const getUserInfo = () => {
    return api.getUserInfo();
};

export const isIntroViewed = async () => {
    (await api.storageGet(STORAGE_KEYS.STATUS)) === 'seen'
        ? router.replacePage(PAGE_MAIN)
        : router.replacePage(PAGE_INTRO);
};
export const setIntroViewed = async () => {
    api.storageSet(STORAGE_KEYS.STATUS, 'seen')
        .then((res) => router.replacePage(PAGE_MAIN))
        .catch(() => router.replacePage(PAGE_MAIN));
};
