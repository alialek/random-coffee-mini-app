import { Panel, Div, Button, View, Gallery, FormLayout, Textarea, Title, Text } from '@vkontakte/vkui';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import coffee from '../img/coffee.png';
import hi from '../img/hi.png';
import handshake from '../img/handshake.png';
import coin from '../img/coin.png';
import gear from '../img/gear.png';
import { PANEL_INTRO } from '../router/routers';
import './intro.css';
import { getProfile, setAbout } from '../store/data/actions';
import { registerUser } from './../services/registerUser';
import { getUserInfo } from '../vk';
import AboutTextArea from './../components/AboutTextArea';
class Intro extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			slideIndex: 0,
			slides: [
				{
					title: 'Привет!',
					description: 'Random Coffee VK - сообщество людей, которые ценят нетворкинг и полезные связи.',
					icon: hi,
					button: 'Далее',
				},
				{
					title: 'Как это работает?',
					description:
						'Каждый понедельник мы соединяем тебя со случайным участником сообщества. Перед встречей или созвоном ознакомься с анкетой собеседника - это поможет найти общие темы',
					icon: gear,
					button: 'Далее',
				},
				{
					title: 'Как вступить в сообщество?',
					description:
						'Все, что нужно сделать - подписаться на нашу группу Random Coffee VK и оформить подписку VK Donut.',
					icon: handshake,
					button: 'Далее',
				},
				{
					title: 'Почему это платно?',
					description: 'Плата за участие - 100₽ в месяц. Что ты получаешь:',
					bullets: [
						'4 встречи с интересными людьми',
						'Заинтересованное коммьюнити',
						'Советы по продуктивному нетворкингу',
					],
					icon: coin,
					button: 'Далее',
				},
				{
					title: 'Давай познакомимся поближе',
					input: (
						<div className="fill-width">
							<AboutTextArea setAbout={(text) => this.props.setAbout(text)} />
						</div>
					),
					button: 'Сохранить',
				},
				{
					title: 'Добро пожаловать!',
					description: 'Теперь осталось дождаться понедельника. Будем рады пообщаться!',
					icon: coffee,
					button: 'Продолжить',
				},
			],
		};
	}
	render() {
		let { profile } = this.props;
		return (
			<View id={this.props.id} activePanel={this.props.activePanel}>
				<Panel id={PANEL_INTRO} separator={false} centered={true} className="intro-panel">
					<Gallery
						onChange={(slideIndex) => this.setState({ slideIndex })}
						slideIndex={this.state.slideIndex}
						slideWidth="100%"
						align="right"
						style={{ width: '100%', height: '100vh' }}
					>
						{this.state.slides.map((slide, i) => (
							<div key={i} className="slide">
								<Div>
									<Title level="1" className="slide__title" weight="semibold">
										{slide.title}
									</Title>
								</Div>
								{slide?.icon && (
									<Div className="d-col align-center">
										<div className="blob-holder">
											{' '}
											<div className="blob"></div>{' '}
											<img className="slide__image" src={slide.icon} />
										</div>

										<Text className="slide__text">{slide.description} </Text>
										{slide?.bullets && (
											<ul>
												{slide.bullets.map((bullet, i) => (
													<li key={i}>{bullet}</li>
												))}
											</ul>
										)}
									</Div>
								)}
								{slide?.input && <Div className="fill-width d-col align-center">{slide.input}</Div>}

								<Div className="slide__button-holder">
									<Button
										onClick={() =>
											slide.button !== 'Продолжить'
												? this.setState(() => this.state.slideIndex++)
												: registerUser(this.props.about)
										}
										mode="primary"
										size="l"
										stretched={true}
									>
										{slide.button}
									</Button>
								</Div>
							</div>
						))}
					</Gallery>
				</Panel>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.data.profile,
		about: state.data.about,
	};
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		...bindActionCreators({ getProfile, setAbout }, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Intro);
