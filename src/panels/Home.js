import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon28NameTagOutline from '@vkontakte/icons/dist/28/name_tag_outline';
import {
    Div,
    Group,
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
    PanelSpinner,
    Card,
    SimpleCell,
    InfoRow,
} from '@vkontakte/vkui';
import { getProfile } from '../store/data/actions';
import { withRouter } from '@happysanta/router';
import { MODAL_ABOUT } from './../router/routers';
import './Home.css';
import { Icon24GearOutline, Icon28Profile, Icon56UsersOutline } from '@vkontakte/icons';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHide: false,
        };
    }
    hideBar = () => {
        const { isHide } = this.state;

        window.scrollY > 100 ? !isHide && this.setState({ isHide: true }) : isHide && this.setState({ isHide: false });

        this.prev = window.scrollY;
    };
    componentDidMount() {
        window.addEventListener('scroll', this.hideBar);
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
                        {' '}
                        <div className="p-relative">
                            {participantInfo.current === {} ? (
                                <div className="profile">
                                    <div className="p-absolute profile__info">
                                        <img className="profile__photo" src={profile.photo_100} />
                                        <Title className="profile__name" level="1" weight="medium">
                                            Ждем следующего понедельника
                                        </Title>
                                        <br />
                                        <Text className="profile__name" weight="regular">
                                            На этой неделе мы не смогли подобрать тебе собеседника
                                        </Text>
                                    </div>
                                </div>
                            ) : (
                                // <div className="profile">
                                //     <Div className="p-absolute profile__info">
                                //         <Title className="profile__title" level="2" weight="medium">
                                //             Твой собеседник  на этой неделе
                                //         </Title>
                                //         <div className="d-row">
                                //             <img className="profile__photo" src={profile.photo_200} />
                                //             <img
                                //                 className="profile__photo profile__photo--participant"
                                //                 src={participantInfo.current.info.photo_200}
                                //             />
                                //         </div>
                                //         <Title className="profile__name" level="1" weight="heavy">
                                //             {participantInfo.current.info.first_name}{' '}
                                //             {participantInfo.current.info.last_name}
                                //         </Title>
                                //         <br />
                                //         <Text className="profile__about" weight="regular">
                                //             {participantInfo.current.info.about}
                                //         </Text>
                                //     </Div>
                                // </div>
                                <div className="profile2">
                                    <div className="p-absolute profile__info2">
                                        <Div>
                                            <Title className="profile__title2" level="3" weight="medium">
                                                Твой собеседник <br /> на этой неделе
                                            </Title>
                                            <Card>
                                                <Div className="d-row profile__participant">
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
                                                </Div>
                                                <SimpleCell>
                                                    <InfoRow header="О себе">
                                                        {' '}
                                                        {participantInfo.current.info.about}
                                                    </InfoRow>
                                                </SimpleCell>
                                                <SimpleCell>
                                                    <InfoRow header="Дата рождения">17 июля 1998г.</InfoRow>
                                                </SimpleCell>
                                                <SimpleCell>
                                                    <InfoRow header="Город">Санкт-Петербург</InfoRow>
                                                </SimpleCell>
                                                <Div сlassName=" buttons d-row align-center">
                                                    <Button mode="secondary" size="l">
                                                        Написать
                                                    </Button>
                                                    <Button mode="primary" size="l">
                                                        <Icon28NameTagOutline />
                                                    </Button>
                                                </Div>
                                            </Card>

                                            <br />
                                        </Div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="history">
                            <Div>
                                <div className="sausage"></div>
                            </Div>
                            <Div>
                                {participantInfo.history.length === 0 ? (
                                    <Placeholder icon={<Icon56UsersOutline />} header="История нетворкинга">
                                        Пока что здесь пусто, но со следующего понедельника здесь появятся интересные
                                        люди
                                    </Placeholder>
                                ) : (
                                    <Fragment>
                                        {participantInfo.history.map((participant, i) => (
                                            <RichCell
                                                key={i}
                                                disabled
                                                before={<Avatar size={48} src={participant.info.photo_100} />}
                                                caption={participant.info.about}
                                                after={
                                                    <Link href={`https://vk.com/im?sel=${participant.info.id}`}>
                                                        <Icon28Profile />
                                                    </Link>
                                                }
                                            >
                                                {participant.info.first_name} {participant.info.last_name}
                                            </RichCell>
                                        ))}{' '}
                                        <Footer>Всего встреч: {participantInfo.history.length}</Footer>
                                    </Fragment>
                                )}
                            </Div>
                        </div>
                    </Fragment>
                )}
                {participantInfo === null && <PanelSpinner />}
                {participantInfo === 'error' && (
                    <Placeholder icon={<Icon56UsersOutline />} header="Ошибка">
                        Кто-то пролил весь рандомный кофе, попробуйте обновить.
                    </Placeholder>
                )}
            </Panel>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.data.profile,
        participantInfo: state.data.participantInfo,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ getProfile }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
