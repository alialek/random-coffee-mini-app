import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon28CancelCircleFillRed from '@vkontakte/icons/dist/28/cancel_circle_fill_red';
import Icon24MessageOutline from '@vkontakte/icons/dist/24/message_outline';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon16UserOutline from '@vkontakte/icons/dist/16/user_outline';
import Icon20UsersOutline from '@vkontakte/icons/dist/20/users_outline';
import Icon28RefreshOutline from '@vkontakte/icons/dist/28/refresh_outline';
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
    RichCell,
    Avatar,
    Footer,
    Link,
    Gallery,
    PanelSpinner,
    Card,
    SimpleCell,
    InfoRow,
    Caption,
    Subhead,
} from '@vkontakte/vkui';
import { getProfile, setSnackbar } from '../store/data/actions';
import { withRouter } from '@happysanta/router';

import { MODAL_ABOUT, MODAL_HISTORY } from './../router/routers';
import './Home.css';
import postBooks from '../img/post1.jpg';
import postGlobe from '../img/post2.jpg';
import {
    Icon24GearOutline,
    Icon28CheckCircleFill,
    Icon28CheckCircleFillYellow,
    Icon28Profile,
    Icon56ErrorOutline,
    Icon56UsersOutline,
} from '@vkontakte/icons';
import Icon24HistoryBackwardOutline from '@vkontakte/icons/dist/24/history_backward_outline';
import Icon24ReportOutline from '@vkontakte/icons/dist/24/report_outline';
import { complain } from './../api/rest/complain';
import { shuffle } from './../api/rest/shuffle';
import { user } from './../api/rest/user';
import { joinCommunity, notifications } from '../vk';
import { setAbout, setParticipantInfo } from './../store/data/actions';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHide: false,
            snackbar: null,
            random: 0,
            ideas: [
                'Как ты добился призвания?',
                'С чего начать погружение в твою сферу деятельности?',
                'Как пропатчить KDE2 под FreeBSD?',
                'Звездные войны или звездный путь?',
                'Для чего ты участвуешь в Random Coffee?',
                'Можешь ли ты помочь мне со следующим проектом?',
                'Если бы открыли границы, куда бы ты поехал в первую очередь?',
                'Как ты борешься с выгоранием?',
            ],
            posts: [
                {
                    img: postBooks,
                    title: 'Что почитать по нетворкингу?',
                    description:
                        'Обзор 5 книг, которые помогут тебе всегда находить темы для разговора, и извлекать пользу из новых знакомств',
                    link: '',
                },
                {
                    img: postGlobe,
                    title: 'Почему нетворкинг - круто?',
                    description:
                        'Обзор 5 книг, которые помогут тебе всегда находить темы для разговора, и извлекать пользу из новых знакомств',
                    link: '',
                },
            ],
        };
    }
    getRandom = () => {
        this.setState({ random: Math.floor(Math.random() * this.state.ideas.length) });
    };
    complain = (id) => {
        complain(id)
            .then(() => {
                this.openSnackBar('Жалоба отправлена', <Icon28CheckCircleFill width={24} height={24} />);
            })
            .catch((err) => {
                err.response.status === 400
                    ? this.openSnackBar(
                          'Вы уже отправили жалобу',
                          <Icon28CheckCircleFillYellow width={24} height={24} />,
                      )
                    : this.openSnackBar('Ошибка подключения', <Icon28CancelCircleFillRed width={24} height={24} />);
            });
    };
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
                this.props.setParticipantInfo({ history: res.data.history, current: res.data.current });
            });
        });
    };
    snackNotifications = (enabled) => (
        <Snackbar
            action="Закрыть"
            onActionClick={() => this.props.setSnackbar(null)}
            onClose={() => this.props.setSnackbar(null)}
            before={<Icon28CheckCircleFill width={24} height={24} />}
        >
            {enabled ? 'Уведомления включены' : 'Уведомления отключены'}
        </Snackbar>
    );
    hideBar = () => {
        const { isHide } = this.state;

        window.scrollY > 100 ? !isHide && this.setState({ isHide: true }) : isHide && this.setState({ isHide: false });

        this.prev = window.scrollY;
    };
    componentDidMount() {
        window.addEventListener('scroll', this.hideBar);
        this.getRandom();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.hideBar);
    }

    render() {
        const { id, profile, router, participantInfo } = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    separator={false}
                    left={
                        <PanelHeaderButton onClick={() => router.pushModal(MODAL_ABOUT)}>
                            <Icon24GearOutline />
                        </PanelHeaderButton>
                    }
                >
                    Random Coffee
                </PanelHeader>
                {participantInfo !== null && (
                    <Fragment>
                        {!Boolean(Object.keys(participantInfo.current).length) && (
                            <div className="profile">
                                <div className="profile__info">
                                    <img className="profile__photo" src={profile.photo_200} />
                                    <Title level="2" weight="medium">
                                        Ждем следующего понедельника
                                    </Title>
                                    <Text className="profile__name" weight="regular">
                                        На этой неделе мы не смогли подобрать тебе собеседника
                                    </Text>
                                    <Button style={{ margin: '16px auto 0 auto' }} onClick={this.shuffle}>
                                        Распределить участников
                                    </Button>
                                </div>
                            </div>
                        )}
                        {Boolean(Object.keys(participantInfo.current).length) && (
                            <div className="profile2">
                                <div className=" profile__info2">
                                    <Div>
                                        <Title level="2" weight="medium">
                                            Твой собеседник на этой неделе
                                        </Title>
                                    </Div>
                                    <Div>
                                        <Card>
                                            <Div>
                                                <div className="d-flex align-center justify-space-between Card__header">
                                                    <div className="d-flex align-center ">
                                                        <Icon16UserOutline fill="#4CD964" width={16} height={16} />{' '}
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
                                                        onClick={() => this.complain(participantInfo.current.id)}
                                                        className="complain-icon"
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
                                                <InfoRow header="О себе"> {participantInfo.current.info.about}</InfoRow>
                                            </SimpleCell>
                                            {participantInfo.current.info?.city && (
                                                <SimpleCell disabled>
                                                    <InfoRow header="Город">
                                                        {participantInfo.current.info.city.title}
                                                    </InfoRow>
                                                </SimpleCell>
                                            )}
                                            <SimpleCell multiline disabled>
                                                <InfoRow header="Что можно спросить">
                                                    <div className="d-row">
                                                        <div className="flex-grow-1">
                                                            {this.state.ideas[this.state.random]}
                                                        </div>
                                                        <div onClick={this.getRandom}>
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
                                    </Div>
                                </div>
                                <Div>
                                    <Title level="2" weight="medium">
                                        Статистика
                                    </Title>
                                </Div>
                                {participantInfo.history.length === 0 ? (
                                    <Placeholder icon={<Icon56UsersOutline />} header="История нетворкинга">
                                        Пока что здесь пусто, но со следующего понедельника здесь появятся интересные
                                        люди
                                    </Placeholder>
                                ) : (
                                    <Div id="history" className="d-grid">
                                        <Card className="history-card" onClick={() => router.pushModal(MODAL_HISTORY)}>
                                            <Div>
                                                <div className="d-flex align-center">
                                                    {' '}
                                                    <Icon24HistoryBackwardOutline
                                                        fill="#2787F5"
                                                        width={16}
                                                        height={16}
                                                    />{' '}
                                                    <Caption
                                                        level="2"
                                                        weight="regular"
                                                        style={{ opacity: 0.7, marginLeft: 8 }}
                                                    >
                                                        ИСТОРИЯ
                                                    </Caption>
                                                </div>
                                                {participantInfo.history.length > 0 ? (
                                                    <Fragment>
                                                        <Title className="history__count" weight="medium" level="1">
                                                            {' '}
                                                            {participantInfo.history.length}
                                                        </Title>
                                                        <Caption level="2" weight="regular" style={{ opacity: 0.7 }}>
                                                            знакомств
                                                        </Caption>
                                                    </Fragment>
                                                ) : (
                                                    <Caption
                                                        level="2"
                                                        weight="regular"
                                                        style={{ opacity: 0.7, textAlign: 'center' }}
                                                    >
                                                        Пока что тут пусто
                                                    </Caption>
                                                )}
                                            </Div>
                                        </Card>

                                        <Card className="history" onClick={() => router.pushModal(MODAL_HISTORY)}>
                                            <Div>
                                                <div className="d-flex align-center">
                                                    {' '}
                                                    <Icon20UsersOutline fill="#4CD964" width={16} height={16} />{' '}
                                                    <Caption
                                                        level="2"
                                                        weight="regular"
                                                        style={{ opacity: 0.7, marginLeft: 8 }}
                                                    >
                                                        СООБЩЕСТВО
                                                    </Caption>
                                                </div>

                                                <Title className="history__count" weight="medium" level="1">
                                                    {' '}
                                                    {participantInfo.metrics.donuts}
                                                </Title>
                                                <Caption level="2" weight="regular" style={{ opacity: 0.7 }}>
                                                    участников
                                                </Caption>
                                            </Div>
                                        </Card>
                                    </Div>
                                )}
                                <Div>
                                    <Title level="2" weight="medium">
                                        Полезное
                                    </Title>
                                </Div>

                                <Div id="history" className="d-grid">
                                    <Card className="history-card standard">
                                        <Div>
                                            <div className="d-flex align-center">
                                                {' '}
                                                <Icon20UsersOutline fill="#fff" width={16} height={16} />{' '}
                                                <Caption
                                                    level="2"
                                                    weight="regular"
                                                    style={{ color: 'white', marginLeft: 8 }}
                                                >
                                                    ГРУППА
                                                </Caption>
                                            </div>

                                            <Text className="history__count history-action" weight="medium">
                                                Подпишитесь на нашу группу Random Coffee
                                            </Text>
                                            <Button
                                                size="s"
                                                stretched
                                                className="action-button"
                                                onClick={() => joinCommunity()}
                                            >
                                                Подписаться
                                            </Button>
                                        </Div>
                                    </Card>

                                    <Card className={`history ${this.props.notifications ? 'active' : 'disabled'}`}>
                                        <Div>
                                            <div className="d-flex align-center">
                                                {' '}
                                                <Icon20UsersOutline fill="#fff" width={16} height={16} />{' '}
                                                <Caption
                                                    level="2"
                                                    weight="regular"
                                                    style={{ color: 'white', marginLeft: 8 }}
                                                >
                                                    УВЕДОМЛЕНИЯ
                                                </Caption>
                                            </div>

                                            <Text className="history__count history-action" weight="medium">
                                                {this.props.notifications
                                                    ? 'Уведомления о новых встречах включены'
                                                    : 'Вы не будете уведомлены о новых встречах'}
                                            </Text>
                                            <Button
                                                size="s"
                                                stretched
                                                className="action-button"
                                                onClick={() =>
                                                    notifications(
                                                        this.snackNotifications(
                                                            this.props.notifications ? false : true,
                                                        ),
                                                    )
                                                }
                                            >
                                                {this.props.notifications ? 'Отключить' : 'Включить'}
                                            </Button>
                                        </Div>
                                    </Card>
                                </Div>

                                <Div>
                                    <Title level="2" weight="medium">
                                        Полезные материалы
                                    </Title>
                                </Div>
                                <Div className="news-grid">
                                    {this.state.posts.map((post) => (
                                        <Link to={post.link}>
                                            <Card style={{ background: `url(${post.img})` }} className="news-card">
                                                <Div>
                                                    <Title level="3" className="news-card__title" weight="medium">
                                                        {post.title}
                                                    </Title>
                                                    <Subhead weight="regular">{post.description}</Subhead>
                                                </Div>{' '}
                                            </Card>
                                        </Link>
                                    ))}
                                </Div>
                            </div>
                        )}
                    </Fragment>
                )}
                {participantInfo === null && <PanelSpinner />}
                {participantInfo === 'error' && (
                    <Placeholder icon={<Icon56ErrorOutline />} header="Ошибка">
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
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setAbout, setParticipantInfo, getProfile, setSnackbar }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
