import {
  Panel,
  Snackbar,
  Div,
  Button,
  View,
  Gallery,
  Title,
  Text,
  Textarea,
  FormLayout,
} from "@vkontakte/vkui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import coffee from "../img/coffee.png";
import hi from "../img/hi.png";
import handshake from "../img/handshake.png";
import gear from "../img/gear.png";
import { PANEL_INTRO, POPOUT_SPINNER } from "../router/routers";
import "./intro.css";
import Icon28CancelCircleFillRed from "@vkontakte/icons/dist/28/cancel_circle_fill_red";
import {
  setInterests,
  getParticipantInfo,
  getProfile,
  setAbout,
} from "./../store/data/actions";
import { setIntroViewed, tapticSelectNotification } from "./../vk/index";
import { updateInterests } from "./../api/rest/interests";
import InterestsPick from "./../components/InterestsPick";
import { withRouter } from "@happysanta/router";
import { register } from "./../api/rest/reg";

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      slideIndex: 0,
      snackbar: null,
      slides: [
        {
          title: "Привет!",
          description:
            "Random Coffee VK — это не про романтичные знакомства! Это сообщество людей, которые ценят нетворкинг и полезные связи.",
          icon: hi,
          button: "Я здесь за нетворкингом!",
          isValid: () => true,
        },
        {
          title: "Как это работает?",
          description:
            "Каждый понедельник мы соединяем тебя со случайным участником сообщества. Перед встречей или созвоном ознакомься с анкетой собеседника — это поможет найти общие темы.",
          icon: gear,
          button: "Далее",
          isValid: () => true,
        },
        {
          title: "Как вступить в сообщество?",
          description: "Все, что нужно сделать — заполнить анкету.",
          icon: handshake,
          button: "Далее",
          isValid: () => true,
        },
        {
          title: "Давай познакомимся поближе",
          input: "О себе",
          button: "Сохранить",
          isValid: () => this.props.about.length > 0,
          fallBack: () => this.openBase("Вы не заполнили поле о себе"),
        },
        {
          title: "Чем ты интересуешься?",
          input: "Интересы",
          button: "Сохранить",
          isValid: () => this.props.interests.length > 0,
          fallBack: () => this.openBase("Выберите хотя бы один интерес"),
        },
        {
          title: "Добро пожаловать!",
          description:
            "Теперь осталось дождаться понедельника. Будем рады пообщаться!",
          icon: coffee,
          isValid: () => true,
          button: "Продолжить",
        },
      ],
    };
  }

  changeIndex(slideIndex) {
    if (this.state.slideIndex === 3) this.inputRef.current.element.blur();
    this.setState({ slideIndex });
  }

  registerUser() {
    if (
      this.state.slides.reduce((previousValue, currentValue) => {
        return previousValue && currentValue.isValid();
      })
    ) {
      this.props.router.replacePopup(POPOUT_SPINNER);
      register(this.props.about)
        .then(() => updateInterests(this.props.interests))
        .then(() => {
          setIntroViewed();
          this.props.getParticipantInfo();
        })
        .finally(() => {
          this.props.router.replacePopup(null);
        });
    } else {
      this.openBase("Вы пропустили некоторые поля");
    }
  }
  getClassName(i) {
    return this.props.interests.includes(i) ? "chip--active" : "";
  }
  setInterests(i) {
    tapticSelectNotification();
    this.props.setInterests(i);
  }

  openBase(text) {
    if (this.state.snackbar) return;
    this.setState({
      snackbar: (
        <Snackbar
          action="Закрыть"
          onActionClick={() => this.setState({ snackbar: null })}
          onClose={() => this.setState({ snackbar: null })}
          before={<Icon28CancelCircleFillRed width={24} height={24} />}
        >
          {text}
        </Snackbar>
      ),
    });
  }
  render() {
    return (
      <View
        id={this.props.id}
        popout={this.props.popout}
        activePanel={this.props.activePanel}
      >
        <Panel
          id={PANEL_INTRO}
          separator={false}
          centered={true}
          className="intro-panel"
        >
          <Gallery
            onChange={(slideIndex) => {
              this.changeIndex(slideIndex);
            }}
            slideIndex={this.state.slideIndex}
            slideWidth="100%"
            align="right"
            style={{ width: "100%", height: "100vh" }}
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
                      {" "}
                      <div className="blob"></div>{" "}
                      <img
                        alt="slide"
                        className="slide__image"
                        src={slide.icon}
                      />
                    </div>

                    <Text className="slide__text">{slide.description} </Text>
                    {slide?.bullets && (
                      <ul>
                        {slide.bullets.map((bullet, n) => (
                          <li key={n}>
                            {" "}
                            <Text>{bullet}</Text>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Div>
                )}
                {slide?.input && slide.input === "О себе" && (
                  <Div className="fill-width d-col align-center">
                    <div className="fill-width">
                      <FormLayout className="slide__form">
                        <Textarea
                          ref={this.inputRef}
                          value={this.props.about}
                          onBlur={(e) =>
                            this.props.setAbout(e.target.value.trim())
                          }
                          onChange={(e) => this.props.setAbout(e.target.value)}
                          top="О себе"
                          maxLength="140"
                          className="about-textarea"
                          placeholder="Здесь ты можешь оставить любую информацию о себе, которая будет полезна участникам"
                        />
                      </FormLayout>
                    </div>
                  </Div>
                )}
                {slide?.input && slide.input === "Интересы" && (
                  <Div>
                    <InterestsPick />
                  </Div>
                )}

                <Div className="slide__button-holder">
                  <Button
                    onClick={() => {
                      if (
                        slide.button === "Сохранить" ||
                        slide.button === "Далее" ||
                        slide.button === "Я здесь за нетворкингом!"
                      ) {
                        slide.isValid()
                          ? this.setState(() => this.state.slideIndex++)
                          : slide.fallBack();
                      }

                      if (slide.button === "Продолжить") this.registerUser();
                    }}
                    mode="primary"
                    size="xl"
                  >
                    {slide.button}
                  </Button>
                </Div>
              </div>
            ))}
          </Gallery>
          {this.state.snackbar}
        </Panel>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    about: state.data.about,
    interests: state.data.interests,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        getProfile,
        setAbout,
        setInterests,
        getParticipantInfo,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Intro));
