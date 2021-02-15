import {
    ANDROID,
    Avatar,
    Footer,
    IOS,
    Link,
    ModalPage,
    ModalPageHeader,
    PanelHeaderButton,
    RichCell,
    withPlatform,
} from '@vkontakte/vkui';
import React, { Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from '@happysanta/router';
import { Icon24Cancel } from '@vkontakte/icons';

class HistoryPage extends Component {
    render() {
        const { participantInfo, id, platform, onClose } = this.props;
        return (
            <ModalPage
                header={
                    <ModalPageHeader
                        left={
                            platform === ANDROID && (
                                <PanelHeaderButton onClick={onClose}>
                                    <Icon24Cancel />
                                </PanelHeaderButton>
                            )
                        }
                        right={platform === IOS && <PanelHeaderButton onClick={onClose}>Закрыть</PanelHeaderButton>}
                    >
                        История
                    </ModalPageHeader>
                }
                id={id}
                dynamicContentHeight
            >
                {participantInfo.history.map((participant, i) => (
                    <Link key={i} href={`https://vk.com/im?sel=${participant.info.id}`}>
                        <RichCell
                            disabled
                            before={<Avatar size={48} src={participant.info.photo_100} />}
                            caption={participant.info.about}
                        >
                            {participant.info.first_name} {participant.info.last_name}
                        </RichCell>
                    </Link>
                ))}{' '}
                <Footer>Всего встреч: {participantInfo.history.length}</Footer>
                <div style={{ height: 5 }} />
            </ModalPage>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        participantInfo: state.data.participantInfo,
    };
};

export default connect(mapStateToProps, null)(withPlatform(withRouter(HistoryPage)));
