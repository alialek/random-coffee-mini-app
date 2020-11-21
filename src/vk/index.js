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
    if (res?.scheme) store.dispatch(setColorScheme(res.scheme));
});

export const notifications = (snack) => {
    console.log('notifi');
    store.getState().data.notifications
        ? api.bridge.send('VKWebAppDenyNotifications').then((res) => {
              store.dispatch({ type: 'SET_NOTIFICATIONS', payload: { data: false } });
              store.dispatch({ type: 'SET_SNACKBAR', payload: { data: snack } });
          })
        : api.bridge
              .send('VKWebAppAllowNotifications')
              .then((res) => {
                  store.dispatch({ type: 'SET_SNACKBAR', payload: { data: snack } });

                  store.dispatch({ type: 'SET_NOTIFICATIONS', payload: { data: true } });
              })
              .catch(() => {});
};

export const getUserInfo = () => {
    return api.getUserInfo();
};

export const joinCommunity = () => {
    return api.joinCommunity(200035810);
};

export const isIntroViewed = async () => {
    return await api.storageGet(STORAGE_KEYS.STATUS);
};
export const setIntroViewed = async () => {
    api.storageSet(STORAGE_KEYS.STATUS, 'viewed').finally(() => router.replacePage(PAGE_MAIN));
};
