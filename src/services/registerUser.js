import { register } from './../api/rest/reg';
import { setIntroViewed } from './../vk/index';

export const registerUser = (about) => {
    return Promise.all([register(about), setIntroViewed()]);
};
