import { VKMiniAppAPI } from '@vkontakte/vk-mini-apps-api';
import { store } from '../index';
import { setColorScheme } from './../store/data/actions';
import {router, PAGE_MAIN, PAGE_INTRO} from '../router/routers'

const api = new VKMiniAppAPI();

const STORAGE_KEYS = {
	STATUS: 'status',
};

export const initApp = () => api.initApp();

api.onUpdateConfig((res) => {
	if (res?.scheme) store.dispatch(setColorScheme(res.scheme))
});

export const getUserInfo = () => {
	return api.getUserInfo()
};

export const isIntroViewed = async () => {
	await api.storageGet(STORAGE_KEYS.STATUS) === 'seen' ? router.replacePage(PAGE_MAIN) : router.replacePage(PAGE_INTRO)
};

export const setStorage = (key, value) => {
	api.send('VKWebAppStorageSet', { key, value });
};


