import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon24MessageOutline from '@vkontakte/icons/dist/24/message_outline';
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
    Link,
    PanelSpinner,
    Card,
    SimpleCell,
    InfoRow,
    Caption,
    Subhead,
} from '@vkontakte/vkui';
import { getProfile, setSnackbar } from '../store/data/actions';
import { withRouter } from '@happysanta/router';
import donut from '../img/donut.png';
import { MODAL_ABOUT, MODAL_HISTORY, POPOUT_CONFIRM } from '../router/routers';
import './Home.css';
import postBooks from '../img/post1.jpg';
import postGlobe from '../img/post2.jpg';
import {
    Icon24GearOutline,
    Icon28CheckCircleFill,
    Icon28CheckCircleFillYellow,
    Icon56ErrorOutline,
    Icon56UsersOutline,
    Icon28ChevronUpOutline,
} from '@vkontakte/icons';
import Icon24HistoryBackwardOutline from '@vkontakte/icons/dist/24/history_backward_outline';
import Icon24ReportOutline from '@vkontakte/icons/dist/24/report_outline';
import coffee from '../img/coffee.png';
import { shuffle } from '../api/rest/shuffle';
import { user } from '../api/rest/user';
import { joinCommunity, notifications } from '../vk';
import { setAbout, setParticipantInfo } from '../store/data/actions';
import { tapticSelectNotification } from '../vk/index';
import Icon16ErrorCircleFill from '@vkontakte/icons/dist/16/error_circle_fill';
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbar: null,
            disabled: false,
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
                    title: 'Как правильно нетворкаться?',
                    description: 'Заповеди нетворкинга, которые помогут подойти к этому делу осознанно и с пониманием.',
                    link: 'https://vk.com/@randomcoffee-rules',
                },
                {
                    img: postGlobe,
                    title: 'Почему нетворкинг — круто?',
                    description: 'Объясняем, почему умение заводить новые знакомства - главный навык в 2021 году.',
                    link: 'https://vk.com/@randomcoffee-pochemu-netvorking-kruto',
                },
            ],
        };
    }
    getRandom = (taptic = true) => {
        if (taptic) tapticSelectNotification();
        this.setState({ random: Math.floor(Math.random() * this.state.ideas.length) });
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
    snackNotifications = (status) => (
        <Snackbar
            action="Закрыть"
            onActionClick={() => this.props.setSnackbar(null)}
            onClose={() => this.props.setSnackbar(null)}
            before={
                status !== 'error' ? (
                    <Icon28CheckCircleFill width={24} height={24} />
                ) : (
                    <Icon16ErrorCircleFill width={24} height={24} />
                )
            }
        >
            {status === 'enabled' && 'Уведомления включены'}
            {status === 'disabled' && 'Уведомления отключены'}
            {status === 'error' && 'Доступ не получен'}
        </Snackbar>
    );

    changeNotifications = () => {
        this.setState({ disabled: true });
        notifications(
            (status) => this.snackNotifications(status),
            () => this.setState({ disabled: false }),
        );
    };
    componentDidMount() {
        this.getRandom(false);
    }

    render() {
        const { id, router, participantInfo } = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    separator={false}
                    left={
                        <PanelHeaderButton
                            onClick={() =>
                                participantInfo !== null && participantInfo !== 'error' && router.pushModal(MODAL_ABOUT)
                            }
                        >
                            <Icon24GearOutline />
                        </PanelHeaderButton>
                    }
                >
                    Random Coffee
                </PanelHeader>
                {participantInfo !== null && participantInfo !== 'error' && (
                    <Fragment>
                        {!(participantInfo.statuses.don && participantInfo.statuses.subscriber) && (
                            <div className="profile2">
                                <Div className=" profile__info2">
                                    <Title className="section-header" level="2" weight="medium">
                                        Твой собеседник на этой неделе
                                    </Title>

                                    <div>
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
                                                            ИНФОРМАЦИЯ
                                                        </Caption>
                                                    </div>
                                                </div>
                                                <div className="d-col justify-center align-center">
                                                    <img className="emoji-placeholder" src={donut} />
                                                    <Caption
                                                        level="1"
                                                        className="text-center"
                                                        weight="regular"
                                                        style={{ opacity: 0.7 }}
                                                    >
                                                        Чтобы принять участие в нетворкинге, необходимо подписаться на
                                                        группу Random Coffee и оформить подписку VK Donut.
                                                    </Caption>
                                                    <Button
                                                        style={{ margin: '16px 0 8px 0' }}
                                                        href="https://vk.com/randomcoffee"
                                                        target="_blank"
                                                    >
                                                        Перейти в группу
                                                    </Button>
                                                </div>
                                            </Div>
                                        </Card>
                                    </div>
                                </Div>
                            </div>
                        )}
                        {participantInfo.statuses.don && (
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
                                                        {' '}
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
                                                                      .split(',')
                                                                      .join(', ')
                                                                : 'Собеседник не указал свои интересы'}
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
                                        </div>
                                    ) : (
                                        <div>
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
                                                                ИНФОРМАЦИЯ
                                                            </Caption>
                                                        </div>
                                                    </div>
                                                    <div className="d-col justify-center align-center">
                                                        <img className="emoji-placeholder" src={donut} />
                                                        <Caption
                                                            level="1"
                                                            className="text-center"
                                                            weight="regular"
                                                            style={{ opacity: 0.7 }}
                                                        >
                                                            Ты участник Random Coffee! Следующее распределение
                                                            участников произойдет в понедельник, не забудь посмотреть,
                                                            кто твой собеседник. А пока можешь поизучать материалы в
                                                            группе
                                                        </Caption>
                                                        <Button
                                                            style={{ margin: '16px 0 8px 0' }}
                                                            href="https://vk.com/randomcoffee"
                                                            target="_blank"
                                                        >
                                                            Перейти в группу
                                                        </Button>
                                                    </div>
                                                </Div>
                                            </Card>
                                        </div>
                                    )}
                                </Div>
                            </div>
                        )}
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
                                                <Icon24HistoryBackwardOutline fill="#2787F5" width={16} height={16} />{' '}
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
                                                style={{ opacity: 0.7, textAlign: 'center', marginTop: 20 }}
                                            >
                                                Пока что тут пусто
                                            </Caption>
                                        )}
                                    </Div>
                                </Card>

                                <Card className="history-card">
                                    <Div>
                                        <div className="d-flex align-center">
                                            {' '}
                                            <Icon20UsersOutline fill="#4CD964" width={16} height={16} />{' '}
                                            <Caption level="2" weight="regular" style={{ opacity: 0.7, marginLeft: 8 }}>
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
                                            В нашей группе мы регулярно публикуем посты с советами по нетворкингу.
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
                                        this.props.notifications ? 'active' : 'disabled'
                                    }`}
                                >
                                    <Div className="fix-height">
                                        <div>
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
                                                    ? 'Мы будем присылать вам уведомления о новых встречах.'
                                                    : 'Вы не будете уведомлены о новых встречах'}
                                            </Text>
                                        </div>

                                        <Button
                                            size="s"
                                            stretched
                                            className={`action-button ${this.state.disabled ? 'button--disabled' : ''}`}
                                            onClick={this.changeNotifications}
                                        >
                                            {this.props.notifications ? 'Отключить' : 'Включить'}
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
                                        <Card style={{ background: `#63b9ba url(${post.img})` }} className="news-card">
                                            <Div>
                                                <Title level="3" className="news-card__title" weight="medium">
                                                    {post.title}
                                                </Title>
                                                <Subhead weight="regular">{post.description}</Subhead>
                                            </Div>{' '}
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </Div>
                    </Fragment>
                )}
                {participantInfo === null && <PanelSpinner />}
                {participantInfo === 'error' && (
                    <Placeholder icon={<img className="emoji-placeholder" src={coffee} />} header="Ошибка">
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
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setAbout, setParticipantInfo, getProfile, setSnackbar }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
