import React, { Component } from 'react';
import { withRouter } from '@happysanta/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Cell, Group, ModalCard, Switch, Textarea, Snackbar } from '@vkontakte/vkui';
import AboutTextArea from './AboutTextArea';
import { notifications } from '../vk';
import { setAbout, setSnackbar } from './../store/data/actions';
import { updateAbout } from '../api';
import { Icon28CheckCircleFill } from '@vkontakte/icons';
import { Icon28CancelCircleFillRed } from '@vkontakte/icons/dist/28/cancel_circle_fill_red';

class AboutCard extends Component {
    render() {
        const snackUpdated = (updated) => (
            <Snackbar
                action="Закрыть"
                onActionClick={() => this.props.setSnackbar(null)}
                onClose={() => this.props.setSnackbar(null)}
                before={
                    updated ? (
                        <Icon28CheckCircleFill width={24} height={24} />
                    ) : (
                        <Icon28CancelCircleFillRed width={24} height={24} />
                    )
                }
            >
                {updated ? 'Обновлено' : 'Произошла ошибка'}
            </Snackbar>
        );

        return (
            <ModalCard
                id={this.props.id}
                onClose={() => this.props.router.popPage()}
                header="Настройки"
                actions={[
                    {
                        title: 'Сохранить',
                        mode: 'primary',
                        action: () => {
                            updateAbout(this.props.about)
                                .then(() => {
                                    this.props.router.popPage();
                                    this.props.setSnackbar(snackUpdated(true));
                                })
                                .catch(() => this.props.setSnackbar(snackUpdated(false)));
                        },
                    },
                ]}
            >
                <Textarea
                    onInput={(e) => this.props.setAbout(e.target.value)}
                    value={this.props.about}
                    top="О себе"
                    maxLength="140"
                    placeholder="Здесь ты можешь оставить любую информацию о себе, которая будет полезна участникам"
                />
            </ModalCard>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        colorScheme: state.data.colorScheme,
        notifications: state.data.notifications,
        about: state.data.about,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setSnackbar, setAbout }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AboutCard));
