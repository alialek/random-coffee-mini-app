import React from 'react';
import { Snackbar } from '@vkontakte/vkui';
/**
 *
 * @param {ReactComponent} icon
 * @param {String} text
 * @param {Function} closeEvent
 */
const showSnackbar = (icon, text, closeEvent) => (
    <Snackbar action="Закрыть" onActionClick={closeEvent} onClose={closeEvent} before={icon}>
        {text}
    </Snackbar>
);

export default showSnackbar;
