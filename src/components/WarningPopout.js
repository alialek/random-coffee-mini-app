import { Alert, Textarea } from "@vkontakte/vkui";
import React, { useState } from "react";
import { useRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { complain } from "../api/rest/complain";
import showSnackbar from "../services/generateSnackbar";
import {
  Icon28CheckCircleFill,
  Icon28CheckCircleFillYellow,
} from "@vkontakte/icons";
import { store } from "../index";
import { tapticNotification } from "../vk";
import Icon28CancelCircleFillRed from "@vkontakte/icons/dist/28/cancel_circle_fill_red";
import { MODAL_ABOUT } from "../router/routers";

function WarningPopout(props) {
  const [complainText, setComplainText] = useState(null);
  const router = useRouter();

  const enterData = (e) => {
    router.replacePopup(null);

    router.pushModal(MODAL_ABOUT);
  };

  return (
    <Alert
      actions={[
        {
          title: "Заполнить профиль",
          mode: "cancel",
          action: enterData,
        },
      ]}
      onClose={enterData}
    >
      <h2>Внимание</h2>
      <p>
        У вас не заполнено описание профиля, перейдите в настройки и внесите
        информацию о себе
      </p>
    </Alert>
  );
}

const mapStateToProps = (state) => {
  return {
    participantInfo: state.data.participantInfo,
  };
};

export default connect(mapStateToProps, null)(WarningPopout);
