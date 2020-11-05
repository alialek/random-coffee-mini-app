import React from 'react';
import ReactDOM from 'react-dom';
import { initApp, isIntroViewed } from './vk/index';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './store/reducers.js';
import App from './App';
import { RouterContext } from '@happysanta/router';
import { router, PAGE_MAIN } from './router/routers.js';

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

initApp();

isIntroViewed();

ReactDOM.render(
	<RouterContext.Provider value={router}>
		<Provider store={store}>
			<App />
		</Provider>
	</RouterContext.Provider>,
	document.getElementById('root'),
);
if (process.env.NODE_ENV === 'development') {
	import('./eruda').then(({ default: eruda }) => {}); //runtime download
}
