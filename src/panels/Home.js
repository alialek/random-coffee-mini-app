import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Icon24MessageOutline from "@vkontakte/icons/dist/24/message_outline";
import Icon16UserOutline from "@vkontakte/icons/dist/16/user_outline";
import Icon20UsersOutline from "@vkontakte/icons/dist/20/users_outline";
import Icon28RefreshOutline from "@vkontakte/icons/dist/28/refresh_outline";
import {
  Div,
  Button,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Title,
  Text,
  Placeholder,
  Link,
  PanelSpinner,
  Card,
  SimpleCell,
  InfoRow,
  Caption,
  Subhead,
  Textarea,
  Gallery,
} from "@vkontakte/vkui";
import { getProfile, setSnackbar } from "../store/data/actions";
import { withRouter } from "@happysanta/router";
import donut from "../img/donut.png";
import {
  MODAL_ABOUT,
  MODAL_HISTORY,
  POPOUT_CONFIRM,
} from "./../router/routers";
import "./Home.css";
import "./Stepper.css";
import postBooks from "../img/post1.jpg";
import postGlobe from "../img/post2.jpg";
import {
  Icon20CheckCircleFillGreen,
  Icon24GearOutline,
  Icon28CheckCircleFill,
  Icon28ChevronUpOutline,
  Icon16Comment,
  Icon16Flash,
} from "@vkontakte/icons";
import Icon24HistoryBackwardOutline from "@vkontakte/icons/dist/24/history_backward_outline";
import Icon24ReportOutline from "@vkontakte/icons/dist/24/report_outline";
import coffee from "../img/coffee.png";
import syntax from "../img/syntax.png";
import { getAdd, notifications } from "../vk";
import { setAbout, getParticipantInfo } from "./../store/data/actions";
import { tapticSelectNotification } from "./../vk/index";
import Icon16ErrorCircleFill from "@vkontakte/icons/dist/16/error_circle_fill";
import { feedback } from "./../api/rest/feedback";
import { type } from "../api";
import { MemoizedCard } from "./../components/IosCard";
import showSnackbar from "./../services/generateSnackbar";
import { contact } from "./../api/rest/contact";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
      disabled: false,
      appStarted: true,
      feedback: null,
      isFeedbackAvailable: [0, 5, 6].includes(new Date().getDay()),
      random: 0,
      instructions: [
        {
          id: 1,
          title: "Вступить в группу",
          description: (
            <div className="description-action">
              <Button>Подписаться</Button>
            </div>
          ),
          isDone: (user) => user.statuses.subscriber,
        },
        {
          id: 2,
          title: "Уточнить цель участия в Random Coffee",
          description: (
            <div className="d-row description-action">
              <Button onClick={() => this.sendType("networking")}>
                Нетворкинг
              </Button>
              <Button onClick={() => this.sendType("dating")}>Свидания</Button>
            </div>
          ),
          isDone(user) {
            return user.type;
          },
        },
        {
          id: 3,
          title: "Оставить первый отзыв",
          description: "Раз в неделю делитесь фидбеком о прошедшем знакомстве",
          isDone: (user) => user.params.first_feedback,
        },
        {
          id: 4,
          title: "Заполнить описание",
          description: "Так собеседникам будет проще узнать вас",
          isDone: (user) => user.about,
        },
        {
          id: 5,
          title: "Подключить VK Donut",
          description: (
            <div>
              <div>Вручную подберем лучших собеседников за 100р./мес</div>
              <Button
                style={{ margin: "8px 0 0 0" }}
                href="https://vk.com/randomcoffee"
                target="_blank"
              >
                Перейти в группу
              </Button>
            </div>
          ),
          isDone: (user) => user.statuses.don,
        },
      ],
      ideas: [
        "Как ты добился(ась) призвания?",
        "С чего начать погружение в твою сферу деятельности?",
        "Кем ты хотел(а) стать в детстве?",
        "Какой твой любимый сериал?",
        "Какой фильм тебя больше всего мотивирует?",
        "Какие книги ты можешь порекомендовать почитать?",
        "Ты занимаешься спортом?",
        "Кто твой любимый персонаж из фильмов?",
        "Как думаешь, необходимо ли высшее образование для успеха в жизни?",
        "Что для тебя значит добиться успеха?",
        "Чай или кофе?",
        "Чем ты занимаешься в свободное время?",
        "Для чего ты участвуешь в Random Coffee?",
        "Можешь ли ты помочь мне со следующим проектом?",
        "Если бы открыли границы, куда бы ты поехал(а) в первую очередь?",
        "Как ты борешься с выгоранием?",
      ],
      posts: [
        {
          img: postBooks,
          title: "Как правильно нетворкаться?",
          description:
            "Заповеди нетворкинга, которые помогут подойти к этому делу осознанно и с пониманием.",
          link: "https://vk.com/@randomcoffee-rules",
        },
        {
          img: postGlobe,
          title: "Почему нетворкинг — круто?",
          description:
            "Объясняем, почему умение заводить новые знакомства - главный навык в 2021 году.",
          link: "https://vk.com/@randomcoffee-pochemu-netvorking-kruto",
        },
      ],
    };
  }

  openParticipant(id) {
    contact();
  }

  sendType(data) {
    type(data)
      .then(() => {
        this.setState({
          snackbar: showSnackbar(
            <Icon28CheckCircleFill width={24} height={24} />,
            "Выбор сделан!",
            () => this.setState({ snackbar: null }),
          ),
        });

        this.props.setParticipantInfo({
          ...this.props.participantInfo,
          type: data,
        });
      })
      .catch(() => {
        this.setState({
          snackbar: showSnackbar(
            <Icon16ErrorCircleFill width={24} height={24} />,
            "Что-то пошло не так, попробуйте еще раз",
            () => this.setState({ snackbar: null }),
          ),
        });
      });
  }

  declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
  getRandom = (taptic = true) => {
    if (taptic) tapticSelectNotification();
    let random = Math.floor(Math.random() * this.state.ideas.length);
    if (random % 3 === 1 && !this.state.appStarted) getAdd("reward");
    this.setState({ random });
    this.setState({ appStarted: false });
  };

  setFeedbackAvailable = (type) => {
    this.setState({ isFeedbackAvailable: type });
  };

  setFeedback = (e) => {
    this.setState({ feedback: e.target.value });
  };

  changeNotifications = () => {
    this.setState({ disabled: true });
    notifications(
      (status) =>
        showSnackbar(
          status !== "error" ? (
            <Icon28CheckCircleFill width={24} height={24} />
          ) : (
            <Icon16ErrorCircleFill width={24} height={24} />
          ),
          status === "enabled"
            ? "Уведомления включены"
            : status === "disabled"
            ? "Уведомления отключены"
            : "Доступ не получен",
          () => this.props.setSnackbar(null),
        ),
      () => this.setState({ disabled: false }),
    );
  };
  sendFeedback = () => {
    if (this.state.feedback) {
      feedback(this.state.feedback).then((res) => {
        if (res.data.status === true) {
          this.setFeedbackAvailable(false);
          this.setState({
            snackbar: showSnackbar(
              <Icon28CheckCircleFill width={24} height={24} />,
              "Спасибо за отзыв!",
              () => this.setState({ snackbar: null }),
            ),
          });
          this.props.getParticipantInfo();
        } else {
          this.setState({
            snackbar: showSnackbar(
              <Icon16ErrorCircleFill width={24} height={24} />,
              "Что-то пошло не так, попробуйте еще раз",
              () => this.setState({ snackbar: null }),
            ),
          });
        }
      });
    } else {
      this.setState({
        snackbar: showSnackbar(
          <Icon16ErrorCircleFill width={24} height={24} />,
          "Введите текст отзыва",
          () => this.setState({ snackbar: null }),
        ),
      });
    }
  };
  componentDidMount() {
    this.getRandom(false);
  }

  render() {
    const { id, router, participantInfo, notifications } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <PanelHeaderButton
              onClick={() =>
                participantInfo !== null &&
                participantInfo !== "error" &&
                router.pushModal(MODAL_ABOUT)
              }
            >
              <Icon24GearOutline />
            </PanelHeaderButton>
          }
        >
          Random Coffee
        </PanelHeader>
        {participantInfo !== null && participantInfo !== "error" && (
          <Fragment>
            <div className="profile2">
              <Div className=" profile__info2">
                <Title className="section-header" level="2" weight="medium">
                  Твой собеседник на этой неделе
                </Title>
                {Boolean(Object.keys(participantInfo.current).length) &&
                notifications ? (
                  <div>
                    <MemoizedCard
                      title="СОБЕСЕДНИК"
                      leftIcon={
                        <Icon16UserOutline
                          fill="#4CD964"
                          width={16}
                          height={16}
                        />
                      }
                      rightIcon={
                        <Icon24ReportOutline
                          width={20}
                          height={20}
                          onClick={() => router.pushPopup(POPOUT_CONFIRM)}
                          className="complain-icon clickable"
                        />
                      }
                    >
                      <>
                        <div className="d-row ">
                          <img
                            alt="Фото участника"
                            className="profile__photo profile__photo--participant2"
                            src={participantInfo.current.info.photo_100}
                          />
                          <div>
                            <Title
                              className="profile__participant-name"
                              level="1"
                              weight="heavy"
                            >
                              {participantInfo.current.info.first_name}
                              <br />
                              {participantInfo.current.info.last_name}
                            </Title>
                          </div>
                        </div>

                        <SimpleCell disabled multiline>
                          <InfoRow header="О себе">
                            {" "}
                            {participantInfo.current.info.about}
                          </InfoRow>
                        </SimpleCell>

                        {participantInfo.current.info?.city && (
                          <SimpleCell disabled>
                            <InfoRow header="Город">
                              {participantInfo.current.info.city.title}
                            </InfoRow>
                          </SimpleCell>
                        )}
                        {participantInfo.current.info?.interests && (
                          <SimpleCell disabled multiline>
                            <InfoRow header="Интересы">
                              {participantInfo.current.info.interests.length > 0
                                ? participantInfo.current.info.interests
                                    .map((i) => this.props.defaultInterests[i])
                                    .toString()
                                    .split(",")
                                    .join(", ")
                                : "Собеседник не указал свои интересы"}
                            </InfoRow>
                          </SimpleCell>
                        )}
                        <SimpleCell multiline disabled>
                          <InfoRow header="Что можно спросить">
                            <div className="d-row">
                              <div className="flex-grow-1">
                                {this.state.ideas[this.state.random]}
                              </div>
                              <div
                                className="clickable"
                                onClick={this.getRandom}
                              >
                                <Icon28RefreshOutline
                                  width={24}
                                  height={24}
                                  style={{ marginLeft: 8 }}
                                />
                              </div>
                            </div>
                          </InfoRow>
                        </SimpleCell>
                        <Link
                          href={`https://vk.com/im?sel=${participantInfo.current.info.id}`}
                          target="_blank"
                        >
                          <Button
                            before={<Icon24MessageOutline />}
                            mode="secondary"
                            onClick={this.openParticipant}
                            stretched
                            size="l"
                          >
                            <div className="d-row align-center">Написать</div>
                          </Button>
                        </Link>
                        <Caption
                          level="1"
                          weight="regular"
                          style={{
                            opacity: 0.7,
                            textAlign: "center",
                            marginTop: 8,
                          }}
                        >
                          Не стесняйтесь писать первыми, все участники этого
                          приложения дают согласие на то, чтобы вы написали!
                        </Caption>
                      </>
                    </MemoizedCard>

                    {this.state.isFeedbackAvailable &&
                      !participantInfo.current?.feedback && (
                        <MemoizedCard
                          title="ОТЗЫВ О СОБЕСЕДНИКЕ"
                          leftIcon={
                            <Icon16Comment
                              fill="#2787f5"
                              width={16}
                              height={16}
                            />
                          }
                          className="feedback-card"
                        >
                          <Textarea
                            onChange={this.setFeedback}
                            placeholder="Удалось ли тебе поговорить с ним? Какие впечатления?"
                          ></Textarea>
                          <Button
                            style={{ marginTop: 8 }}
                            mode="secondary"
                            size="l"
                            stretched
                            onClick={this.sendFeedback}
                          >
                            Отправить
                          </Button>
                        </MemoizedCard>
                      )}
                  </div>
                ) : (
                  <div>
                    <MemoizedCard
                      leftIcon={
                        <Icon16UserOutline
                          fill="#4CD964"
                          width={16}
                          height={16}
                        />
                      }
                      title="ИНФОРМАЦИЯ"
                    >
                      <div className="d-col justify-center align-center">
                        <img
                          alt="Вкусный эмодзи"
                          className="emoji-placeholder"
                          src={donut}
                        />
                        <Caption
                          level="1"
                          weight="regular"
                          style={{ opacity: 0.7, textAlign: "center" }}
                        >
                          {notifications && (
                            <>
                              Ты участник Random Coffee! <br /> <br />{" "}
                              Возвращайся в следующий понедельник, чтобы узнать,
                              кто твой собеседник. А пока ознакомься с
                              материалами по нетворкингу в группе.
                            </>
                          )}
                          {!notifications && (
                            <>
                              Чтобы принять участие в Random Coffee, необходимо
                              включить уведомления. Это нужно для оповещения
                              участников о новых собеседниках.
                              <br /> <br /> Если захотите прекратить участие в
                              нетворкинге - просто отключите уведомления.
                            </>
                          )}
                        </Caption>

                        {notifications && (
                          <Button
                            style={{ margin: "16px 0 8px 0" }}
                            href="https://vk.com/randomcoffee"
                            target="_blank"
                            mode="secondary"
                          >
                            Перейти в группу
                          </Button>
                        )}

                        {!notifications && (
                          <Button
                            style={{ margin: "16px 0 8px 0" }}
                            target="_blank"
                            onClick={this.changeNotifications}
                          >
                            Включить уведомления
                          </Button>
                        )}
                      </div>
                    </MemoizedCard>
                  </div>
                )}
              </Div>
            </div>
            <Div>
              <Title className="section-header" level="2" weight="medium">
                Улучшить алгоритм
              </Title>

              <MemoizedCard
                title="ИНСТРУКЦИЯ"
                leftIcon={<Icon16Flash fill="#2787F5" width={16} height={16} />}
                className="history-card"
              >
                {this.state.instructions.map((step) => (
                  <div key={step.id} className="d-flex stepper">
                    {step.isDone(participantInfo) ? (
                      <Icon20CheckCircleFillGreen />
                    ) : (
                      <div className="stepper-num">
                        <div>{step.id}</div>
                      </div>
                    )}
                    <div className="stepper-text">
                      <Text weight="semibold">{step.title}</Text>
                      <Caption level="1">
                        {step.isDone(participantInfo)
                          ? "Выполнено"
                          : step.description}
                      </Caption>
                    </div>
                  </div>
                ))}
              </MemoizedCard>
            </Div>

            <Div>
              <Title className="section-header" level="2" weight="medium">
                Статистика
              </Title>

              <div id="history" className="d-grid">
                <MemoizedCard
                  className="history-card clickable"
                  title="ИСТОРИЯ"
                  leftIcon={
                    <Icon24HistoryBackwardOutline
                      fill="#2787F5"
                      width={16}
                      height={16}
                    />
                  }
                  rightIcon={
                    participantInfo.history.length > 0 && (
                      <Icon28ChevronUpOutline
                        className="card-header__action"
                        width={16}
                        height={16}
                      />
                    )
                  }
                  onClick={() => router.pushModal(MODAL_HISTORY)}
                >
                  {participantInfo.history.length > 0 ? (
                    <Fragment>
                      <Title
                        className="history__count"
                        weight="medium"
                        level="1"
                      >
                        {" "}
                        {participantInfo.history.length}
                      </Title>
                      <Caption
                        level="2"
                        weight="regular"
                        style={{ opacity: 0.7 }}
                      >
                        {this.declOfNum(participantInfo.history.length, [
                          "знакомство",
                          "знакомства",
                          "знакомств",
                        ])}
                      </Caption>
                    </Fragment>
                  ) : (
                    <Caption
                      level="2"
                      weight="regular"
                      style={{
                        opacity: 0.7,
                        textAlign: "center",
                        marginTop: 20,
                      }}
                    >
                      Пока что тут пусто
                    </Caption>
                  )}
                </MemoizedCard>

                <MemoizedCard
                  title="СООБЩЕСТВО"
                  leftIcon={
                    <Icon20UsersOutline fill="#4CD964" width={16} height={16} />
                  }
                  className="history-card"
                >
                  <Title className="history__count" weight="medium" level="1">
                    {participantInfo.metrics.members}
                  </Title>
                  <Caption level="2" weight="regular" style={{ opacity: 0.7 }}>
                    {this.declOfNum(participantInfo.metrics.members, [
                      "участник",
                      "участника",
                      "участников",
                    ])}
                  </Caption>
                </MemoizedCard>
              </div>
            </Div>
            {/* <Div>
              <Title className="section-header" level="2" weight="medium">
                Полезное
              </Title>

              <div id="history" className="d-grid">
                <Card className="history-card standard">
                  <Div className="fix-height">
                    <div className="d-flex align-center">
                      {" "}
                      <Icon20UsersOutline
                        fill="#fff"
                        width={16}
                        height={16}
                      />{" "}
                      <Caption
                        level="2"
                        weight="regular"
                        style={{ color: "white", marginLeft: 8 }}
                      >
                        ГРУППА
                      </Caption>
                    </div>

                    <Text
                      className="history__count history-action"
                      weight="medium"
                    >
                      В нашей группе ты найдешь советы по эффективному
                      нетворкингу.
                    </Text>
                    <Link target="_blank" href="https://vk.com/randomcoffee">
                      <Button size="s" stretched className="action-button">
                        Перейти в группу
                      </Button>
                    </Link>
                  </Div>
                </Card>

                <Card
                  className={`history-card transition ${
                    this.props.notifications ? "active" : "disabled"
                  }`}
                >
                  <Div className="fix-height">
                    <div>
                      <div className="d-flex align-center">
                        {" "}
                        <Icon20UsersOutline
                          fill="#fff"
                          width={16}
                          height={16}
                        />{" "}
                        <Caption
                          level="2"
                          weight="regular"
                          style={{ color: "white", marginLeft: 8 }}
                        >
                          УВЕДОМЛЕНИЯ
                        </Caption>
                      </div>

                      <Text
                        className="history__count history-action"
                        weight="medium"
                      >
                        {this.props.notifications
                          ? "Мы будем присылать вам уведомления о новых встречах."
                          : "Вы не будете уведомлены о новых встречах"}
                      </Text>
                    </div>

                    <Button
                      size="s"
                      stretched
                      className={`action-button ${
                        this.state.disabled ? "button--disabled" : ""
                      }`}
                      onClick={this.changeNotifications}
                    >
                      {this.props.notifications ? "Отключить" : "Включить"}
                    </Button>
                  </Div>
                </Card>
              </div>
            </Div> */}

            <Div>
              <Title level="2" className="section-header" weight="medium">
                Статьи и материалы
              </Title>
            </Div>

            <Gallery style={{ paddingLeft: "12px" }} slideWidth={"70%"}>
              {this.state.posts.map((post, i) => (
                <Link key={i} href={post.link} target="_blank">
                  <Card
                    style={{ background: `#63b9ba url(${post.img})` }}
                    className="news-card"
                  >
                    <Div>
                      <Title
                        level="3"
                        className="news-card__title"
                        weight="medium"
                      >
                        {post.title}
                      </Title>
                      <Subhead weight="regular">{post.description}</Subhead>
                    </Div>
                  </Card>
                </Link>
              ))}
            </Gallery>
            <Div style={{ textAlign: "center" }}>
              <Link href={`https://vk.com/dev_syntax`} target="_blank">
                <h5 className="Subhead Subhead--ios Subhead--w-regular InfoRow__header">
                  Сделано с ❤️ в Syntax
                </h5>
                <img
                  alt="Syntax"
                  style={{ width: 100, marginTop: 8 }}
                  src={syntax}
                />
              </Link>
            </Div>
          </Fragment>
        )}
        {participantInfo === null && <PanelSpinner />}
        {participantInfo === "error" && (
          <Placeholder
            icon={
              <img
                alt="Кофейный эмодзи"
                className="emoji-placeholder"
                src={coffee}
              />
            }
            header="Ошибка"
          >
            Кто-то пролил весь рандомный кофе, попробуйте обновить.
          </Placeholder>
        )}
        {this.state.snackbar}
        {this.props.snackbar}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    participantInfo: state.data.participantInfo,
    snackbar: state.data.snackbar,
    notifications: state.data.notifications,
    defaultInterests: state.data.defaultInterests,
    add: state.data.add,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      { setAbout, getProfile, setSnackbar, getParticipantInfo },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
