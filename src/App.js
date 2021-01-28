import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from '@happysanta/router';
import '@vkontakte/vkui/dist/vkui.css';

import Intro from './views/Intro';
import Main from './views/Main';
import { ConfigProvider, ScreenSpinner, Root, ModalRoot } from '@vkontakte/vkui';
import {
    router,
    VIEW_INTRO,
    VIEW_MAIN,
    MODAL_ABOUT,
    POPOUT_CONFIRM,
    PAGE_MAIN,
    PAGE_INTRO,
    MODAL_HISTORY,
    POPOUT_SPINNER,
} from './router/routers';
import './App.css';
import { auth, user } from './api';
import { saveCredentials } from './services';
import AboutCard from './components/AboutCard';
import HistoryPage from './components/HistoryPage';
import { getAdd, getUserInfo, isIntroViewed } from './vk';
import { getProfile, setNotifications, setAbout, setParticipantInfo, setInterests } from './store/data/actions';
import Confirm from './components/ConfirmationPopout';

class App extends React.Component {
    popout() {
        const { location } = this.props;
        if (location.getPopupId() === POPOUT_CONFIRM) {
            return <Confirm />;
        } else if (location.getPopupId() === POPOUT_SPINNER) {
            return <ScreenSpinner />;
        }
    }
    async componentDidMount() {
        if ((await isIntroViewed()) === 'ye') {
            router.replacePage(PAGE_MAIN);

            auth(window.location.search).then((resp) => {
                saveCredentials(resp);

                user()
                    .then((res) => {
                        this.props.setAbout(res.data.about);
                        this.props.setInterests(res.data.interests);
                        this.props.setParticipantInfo({
                            history: res.data.history,
                            current: res.data.current,
                            metrics: res.data.metrics,
                            statuses: res.data.statuses,
                        });
                    })
                    .catch(() => {
                        this.props.setParticipantInfo('error');
                    });
            });
            getAdd('preloader');
        } else {
            router.replacePage(PAGE_INTRO);
            auth(window.location.search).then((resp) => {
                saveCredentials(resp);
            });
        }
        getUserInfo().then((res) => this.props.getProfile(res));
        this.props.setNotifications(
            Boolean(+window.location.search.split('vk_are_notifications_enabled=')[1].charAt(0)),
        );
    }
    render() {
        const { location, colorScheme, router } = this.props;
        const popout = this.popout();
        const modal = (
            <ModalRoot onClose={() => router.popPage()} activeModal={location.getModalId()}>
                <AboutCard id={MODAL_ABOUT} />
                <HistoryPage onClose={() => router.popPage()} id={MODAL_HISTORY} />
            </ModalRoot>
        );
        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Root activeView={location.getViewId()}>
                    <Intro popout={popout} activePanel={location.getViewActivePanel(VIEW_INTRO)} id={VIEW_INTRO} />
                    <Main
                        activePanel={location.getViewActivePanel(VIEW_MAIN)}
                        history={location.getViewHistory(VIEW_MAIN)}
                        id={VIEW_MAIN}
                        modal={modal}
                        popout={popout}
                    />
                </Root>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        colorScheme: state.data.colorScheme,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ getProfile, setNotifications, setAbout, setParticipantInfo, setInterests }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
