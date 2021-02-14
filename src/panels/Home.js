import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Icon24MessageOutline from "@vkontakte/icons/dist/24/message_outline";
import Icon16UserOutline from "@vkontakte/icons/dist/16/user_outline";
import Icon20UsersOutline from "@vkontakte/icons/dist/20/users_outline";
import Icon28RefreshOutline from "@vkontakte/icons/dist/28/refresh_outline";
import {
  Div,
  Snackbar,
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
} from "@vkontakte/icons";
import Icon24HistoryBackwardOutline from "@vkontakte/icons/dist/24/history_backward_outline";
import Icon24ReportOutline from "@vkontakte/icons/dist/24/report_outline";
import coffee from "../img/coffee.png";
import { shuffle } from "./../api/rest/shuffle";
import { user } from "./../api/rest/user";
import { getAdd, notifications } from "../vk";
import { setAbout, setParticipantInfo } from "./../store/data/actions";
import { tapticSelectNotification } from "./../vk/index";
import Icon16ErrorCircleFill from "@vkontakte/icons/dist/16/error_circle_fill";
import { feedback } from "./../api/rest/feedback";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
      disabled: false,
      appStarted: true,
      feedback: null,
      random: 0,
      ideas: [
        "Как ты добился(ась) призвания?",
        "С чего начать погружение в твою сферу деятельности?",
        "Кем ты хотел(а) стать в детстве?",
        "Какой твой любимый сериал?",
        "Какой фильм тебя больше всего мотивирует?",
        "Какие книги ты помжешь порекомендовать почитать?",
        "Ты занимаешься спортом?",
        "Кто твой любимый персонаж из фильмов?",
        "Как думаешь, необходимо ли высшее образование для успеха в жизни?",
        "Что для тебя значит добиться успеха?",
        "Чай или кофе?",
        "Чем ты занимаешься в свободное время?",
        "Звездные войны или звездный путь?",
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

  isFeedbackAvailable = () => {
    return [0, 5, 6].includes(new Date().getDay());
  };

  setFeedback(e) {
    this.setState({ feedback: e.target.value });
  }

  openSnackBar(text, icon) {
    if (this.state.snackbar) return;
    this.setState({
      snackbar: (
        <Snackbar
          layout="vertical"
          action="Закрыть"
          onActionClick={() => this.setState({ snackbar: null })}
          onClose={() => this.setState({ snackbar: null })}
          before={icon}
        >
          {text}
        </Snackbar>
      ),
    });
  }
  shuffle = () => {
    shuffle().then(() => {
      user().then((res) => {
        this.props.setAbout(res.data.about);
        this.props.setParticipantInfo({
          history: res.data.history,
          current: res.data.current,
        });
      });
    });
  };
  snackNotifications = (status) => (
    <Snackbar
      action="Закрыть"
      onActionClick={() => this.props.setSnackbar(null)}
      onClose={() => this.props.setSnackbar(null)}
      before={
        status !== "error" ? (
          <Icon28CheckCircleFill width={24} height={24} />
        ) : (
          <Icon16ErrorCircleFill width={24} height={24} />
        )
      }
    >
      {status === "enabled" && "Уведомления включены"}
      {status === "disabled" && "Уведомления отключены"}
      {status === "error" && "Доступ не получен"}
    </Snackbar>
  );

  changeNotifications = () => {
    this.setState({ disabled: true });
    notifications(
      (status) => this.snackNotifications(status),
      () => this.setState({ disabled: false }),
    );
  };
  sendFeedback() {
    feedback(this.state.feedback).then((res) => {});
  }
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
                {Boolean(Object.keys(participantInfo.current).length) ? (
                  <div>
                    <Card>
                      <Div>
                        <div className="d-flex align-center justify-space-between Card__header">
                          <div className="d-flex align-center ">
                            <Icon16UserOutline
                              fill="#4CD964"
                              width={16}
                              height={16}
                            />{" "}
                            <Caption
                              level="2"
                              weight="regular"
                              style={{ opacity: 0.7, marginLeft: 8 }}
                            >
                              СОБЕСЕДНИК
                            </Caption>
                          </div>

                          <Icon24ReportOutline
                            width={20}
                            height={20}
                            onClick={() => router.pushPopup(POPOUT_CONFIRM)}
                            className="complain-icon clickable"
                          />
                        </div>
                        <div className="d-row ">
                          <img
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
                      </Div>
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
                            <div className="clickable" onClick={this.getRandom}>
                              <Icon28RefreshOutline
                                width={24}
                                height={24}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          </div>
                        </InfoRow>
                      </SimpleCell>
                      <Div>
                        <Link
                          target="_blank"
                          href={`https://vk.com/im?sel=${participantInfo.current.info.id}`}
                        >
                          <Button
                            before={<Icon24MessageOutline />}
                            mode="secondary"
                            stretched
                            size="l"
                          >
                            <div className="d-row align-center">Написать</div>
                          </Button>
                        </Link>
                      </Div>
                    </Card>
                    <Card style={{ marginTop: 16 }}>
                      {this.isFeedbackAvailable() &&
                        !participantInfo.current?.feedback && (
                          <SimpleCell multiline disabled>
                            <InfoRow header="Оставь отзыв о собеседнике">
                              <Textarea
                                onChange={this.setFeedback}
                                placeholder="Удалось ли тебе поговорить с ним? Какие впечатления?"
                              ></Textarea>
                              <Button
                                style={{ marginTop: 8 }}
                                mode="secondary"
                                size="l"
                                onClick={this.sendFeedback}
                              >
                                Отправить
                              </Button>
                            </InfoRow>
                          </SimpleCell>
                        )}
                    </Card>
                  </div>
                ) : (
                  <div>
                    <Card>
                      <Div>
                        <div className="d-flex align-center justify-space-between Card__header">
                          <div className="d-flex align-center ">
                            <Icon16UserOutline
                              fill="#4CD964"
                              width={16}
                              height={16}
                            />{" "}
                            <Caption
                              level="2"
                              weight="regular"
                              style={{ opacity: 0.7, marginLeft: 8 }}
                            >
                              ИНФОРМАЦИЯ
                            </Caption>
                          </div>
                        </div>
                        <div className="d-col justify-center align-center">
                          <img className="emoji-placeholder" src={donut} />
                          <Caption
                            level="1"
                            weight="regular"
                            style={{ opacity: 0.7 }}
                          >
                            {notifications && (
                              <>
                                Ты участник Random Coffee! <br /> Возвращайся в
                                следующий понедельник, чтобы узнать, кто твой
                                собеседник. А пока ознакомься с материалами по
                                нетворкингу в группе.
                              </>
                            )}
                            {!notifications && (
                              <>
                                Чтобы принять участие в Random Coffee,
                                необходимо включить уведомления. Это нужно для
                                оповещения участников о новых собеседниках.
                                <br /> Если захотите прекратить участие в
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
                      </Div>
                    </Card>
                  </div>
                )}
              </Div>
            </div>
            {/* <Div>
              <Title className="section-header" level="2" weight="medium">
                Улучшить алгоритм
              </Title>

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
                      ИНСТРУКЦИЯ
                    </Caption>
                  </div>
                  <div className="d-flex stepper">
                    {true ? (
                      <Icon20CheckCircleFillGreen />
                    ) : (
                      <div className="stepper-num">
                        <div>1</div>
                      </div>
                    )}
                    <div className="stepper-text">
                      <Text weight="semibold">
                        Вступить в группу Вступить в группу Вступить в группу
                        Вступить в группу Вступить в группу
                      </Text>
                    </div>
                  </div>

                  <Link target="_blank" href="https://vk.com/randomcoffee">
                    <Button size="s" stretched className="action-button">
                      Перейти в группу
                    </Button>
                  </Link>
                </Div>
              </Card>
            </Div> */}

            <Div>
              <Title className="section-header" level="2" weight="medium">
                Статистика
              </Title>

              <div id="history" className="d-grid">
                <Card
                  className="history-card clickable"
                  onClick={() => router.pushModal(MODAL_HISTORY)}
                >
                  <Div>
                    <div className="d-flex align-center justify-space-between">
                      <div className="d-flex align-center">
                        <Icon24HistoryBackwardOutline
                          fill="#2787F5"
                          width={16}
                          height={16}
                        />{" "}
                        <Caption
                          level="2"
                          weight="regular"
                          style={{ opacity: 0.7, marginLeft: 8 }}
                        >
                          ИСТОРИЯ
                        </Caption>
                      </div>
                      {participantInfo.history.length > 0 && (
                        <Icon28ChevronUpOutline
                          className="card-header__action"
                          width={16}
                          height={16}
                        />
                      )}
                    </div>
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
                  </Div>
                </Card>

                <Card className="history-card">
                  <Div>
                    <div className="d-flex align-center">
                      <Icon20UsersOutline
                        fill="#4CD964"
                        width={16}
                        height={16}
                      />{" "}
                      <Caption
                        level="2"
                        weight="regular"
                        style={{ opacity: 0.7, marginLeft: 8 }}
                      >
                        СООБЩЕСТВО
                      </Caption>
                    </div>

                    <Title className="history__count" weight="medium" level="1">
                      {participantInfo.metrics.members}
                    </Title>
                    <Caption
                      level="2"
                      weight="regular"
                      style={{ opacity: 0.7 }}
                    >
                      {this.declOfNum(participantInfo.metrics.members, [
                        "участник",
                        "участника",
                        "участников",
                      ])}
                    </Caption>
                  </Div>
                </Card>
              </div>
            </Div>
            <Div>
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
            </Div>

            <Div>
              <Title level="2" className="section-header" weight="medium">
                Статьи и материалы
              </Title>

              <div className="news-grid">
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
                      </Div>{" "}
                    </Card>
                  </Link>
                ))}
              </div>
            </Div>
          </Fragment>
        )}
        {participantInfo === null && <PanelSpinner />}
        {participantInfo === "error" && (
          <Placeholder
            icon={<img className="emoji-placeholder" src={coffee} />}
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
      { setAbout, setParticipantInfo, getProfile, setSnackbar },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
