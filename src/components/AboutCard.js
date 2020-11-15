import React, { Component } from 'react';
import { withRouter } from '@happysanta/router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Cell, Group, ModalCard, Switch, Textarea } from '@vkontakte/vkui';
import AboutTextArea from './AboutTextArea';
import { notifications } from '../vk';
import { setAbout } from './../store/data/actions';
import { updateAbout } from '../api';

class AboutCard extends Component {
    render() {
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
                            updateAbout(this.props.about).then(() => this.props.router.popPage());
                        },
                    },
                ]}
            >
                <Group className="my-1">
                    <Cell
                        size="l"
                        asideContent={<Switch checked={this.props.notifications} onChange={notifications} />}
                    >
                        Уведомления о встречах
                    </Cell>
                </Group>
                <Textarea
                    onInput={(e) => this.props.setAbout(e.target.value)}
                    value={this.props.about}
                    top="О себе"
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
        ...bindActionCreators({ setAbout }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AboutCard));
