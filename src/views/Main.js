import Home from '../panels/Home';

import React, { Component } from 'react';
import { View } from '@vkontakte/vkui';
import { PANEL_MAIN } from './../router/routers';

class Main extends Component {
	render() {
		return (
			<View id={this.props.id} activePanel={this.props.activePanel}>
				<Home id={PANEL_MAIN} />
			</View>
		);
	}
}

export default Main;
