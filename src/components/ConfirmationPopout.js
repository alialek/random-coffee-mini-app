import { Alert } from '@vkontakte/vkui';
import React from 'react';
import { useRouter } from '@happysanta/router';
import { complainOnUser } from './../store/data/actions';
import { connect } from 'react-redux';
import { complain } from './../api/rest/complain';
import showSnackbar from './../services/generateSnackbar';
import { Icon28CheckCircleFill, Icon28CheckCircleFillYellow } from '@vkontakte/icons';
import { store } from './../index';
import { tapticNotification } from '../vk';
import Icon28CancelCircleFillRed from '@vkontakte/icons/dist/28/cancel_circle_fill_red';

function Confirm(props) {
    const showError = () => store.dispatch({
        type: 'SET_SNACKBAR',
        payload: {
            data: showSnackbar(<Icon28CancelCircleFillRed width={24} height={24} />, 'Ошибка подключения', () =>
                store.dispatch({ type: 'SET_SNACKBAR', payload: { data: null } }),
            ),
        },
    });
    const complainOnUser = () => {
        complain(props.participantInfo.current.id)
            .then(() => {
                store.dispatch({
                    type: 'SET_SNACKBAR',
                    payload: {
                        data: showSnackbar(<Icon28CheckCircleFill width={24} height={24} />, 'Жалоба отправлена', () =>
                            store.dispatch({ type: 'SET_SNACKBAR', payload: { data: null } }),
                        ),
                    },
                });

                tapticNotification('success');
            })
            .catch((err) => {
                tapticNotification('error');
                console.log(err.response);
                try {
                    err?.response.status === 400
                        ? store.dispatch({
                              type: 'SET_SNACKBAR',
                              payload: {
                                  data: showSnackbar(
                                      <Icon28CheckCircleFillYellow width={24} height={24} />,
                                      'Жалоба на этого пользователя уже отправлена',
                                      () => store.dispatch({ type: 'SET_SNACKBAR', payload: { data: null } }),
                                  ),
                              },
                          })
                        : showError();
                } catch {
                    showError();
                }
            });
    };
    const router = useRouter();
    return (
        <Alert
            actions={[
                {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel',
                },
                {
                    title: 'Пожаловаться',
                    mode: 'destructive',
                    autoclose: true,
                    action: complainOnUser,
                },
            ]}
            onClose={() => router.popPage()}
        >
            <h2>Подтвердите действие</h2>
            <p>Вы хотите отправить жалобу на этого пользователя?</p>
        </Alert>
    );
}

const mapStateToProps = (state) => {
    return {
        participantInfo: state.data.participantInfo,
    };
};

export default connect(mapStateToProps, null)(Confirm);
