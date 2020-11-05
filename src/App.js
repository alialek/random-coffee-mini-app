import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';

import Intro from './views/Intro';
import Main from './views/Main';
import { ConfigProvider, View, ScreenSpinner, Root } from '@vkontakte/vkui';
import { VIEW_INTRO, VIEW_MAIN } from './router/routers';
import './App.css'
class App extends React.Component {
	render() {
		const { location, colorScheme } = this.props;
		return (
			<ConfigProvider isWebView={true} scheme={colorScheme}>
				<Root activeView={location.getViewId()}>
					<Intro activePanel={location.getViewActivePanel(VIEW_INTRO)} id={VIEW_INTRO} />
					<Main
						activePanel={location.getViewActivePanel(VIEW_MAIN)}
						history={location.getViewHistory(VIEW_MAIN)}
						id={VIEW_MAIN}
					/>
				</Root>
			</ConfigProvider>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		colorScheme: state.data.colorScheme
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({}, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
