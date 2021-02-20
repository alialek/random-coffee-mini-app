import Home from '../panels/Home';

import React, { Component } from 'react';
import { View } from '@vkontakte/vkui';
import { PANEL_MAIN } from './../router/routers';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			popout: null
		}
	}

	setPopout = (props) => {
		this.setState({
			popout: props
		})
		console.log(props)
	}

	closePopout = () => {
		this.setState({
			popout: null
		})
	}

	render() {
		return (
			<View id={this.props.id} modal={this.props.modal} activePanel={this.props.activePanel} popout={this.state.popout}>
				<Home id={PANEL_MAIN} setPopout={(props) => this.setPopout(props)} closePopout={() => this.closePopout()}/>
			</View>
		);
	}
}

export default Main;
