import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';

import Intro from './views/Intro';
import Main from './views/Main';
import { ConfigProvider, ScreenSpinner, Root, ModalRoot } from '@vkontakte/vkui';
import { VIEW_INTRO, VIEW_MAIN, MODAL_ABOUT } from './router/routers';
import './App.css';
import { auth, user } from './api';
import { saveCredentials } from './services';
import AboutCard from './components/AboutCard';
import { getUserInfo } from './vk';
import { getProfile, setNotifications, setAbout, setParticipantInfo } from './store/data/actions';

class App extends React.Component {
    componentDidMount() {
        getUserInfo().then((res) => this.props.getProfile(res));
        this.props.setNotifications(
            Boolean(+window.location.search.split('vk_are_notifications_enabled=')[1].charAt(0)),
        );

        auth(window.location.search)
            .then((resp) => {
                saveCredentials(resp);
                user().then((res) => {
                    this.props.setAbout(res.data.about);
                    this.props.setParticipantInfo({ history: [res.data.current], current: res.data.current });
                });
            })
            .finally(() => {});
    }
    render() {
        const { location, colorScheme, router } = this.props;
        console.log(this.props);
        const modal = (
            <ModalRoot onClose={() => router.popPage()} activeModal={location.getModalId()}>
                <AboutCard id={MODAL_ABOUT} />
            </ModalRoot>
        );
        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Root activeView={location.getViewId()}>
                    <Intro activePanel={location.getViewActivePanel(VIEW_INTRO)} id={VIEW_INTRO} />
                    <Main
                        activePanel={location.getViewActivePanel(VIEW_MAIN)}
                        history={location.getViewHistory(VIEW_MAIN)}
                        id={VIEW_MAIN}
                        modal={modal}
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
        ...bindActionCreators({ getProfile, setNotifications, setAbout, setParticipantInfo }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
