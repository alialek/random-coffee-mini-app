import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ModalCard, Textarea } from "@vkontakte/vkui";
import { tapticNotification } from "../vk";
import { setAbout, setSnackbar, setInterests } from "./../store/data/actions";
import { updateAbout } from "../api";
import { Icon28CheckCircleFill } from "@vkontakte/icons";
import Icon28CancelCircleFillRed from "@vkontakte/icons/dist/28/cancel_circle_fill_red";
import { updateInterests } from "./../api/rest/interests";
import InterestsPick from "./InterestsPick";
import { POPOUT_SPINNER } from "./../router/routers";
import showSnackbar from "./../services/generateSnackbar";

class AboutCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
    };
  }
  render() {
    const snackUpdated = (updated, text) =>
      showSnackbar(
        updated ? (
          <Icon28CheckCircleFill width={24} height={24} />
        ) : (
          <Icon28CancelCircleFillRed width={24} height={24} />
        ),
        text,
        () =>
          updated
            ? this.props.setSnackbar(null)
            : this.setState({ snackbar: null }),
      );

    return (
      <ModalCard
        id={this.props.id}
        onClose={() => this.props.router.popPage()}
        header="Настройки"
        actions={[
          {
            title: "Сохранить",
            mode: "primary",
            action: () => {
              if (this.props.about.length && this.props.interests.length) {
                this.props.router.replacePopup(POPOUT_SPINNER);
                Promise.all([
                  updateAbout(this.props.about),
                  updateInterests(this.props.interests),
                ])
                  .then(() => {
                    this.props.router.popPage();
                    tapticNotification("success");
                    this.props.setSnackbar(
                      snackUpdated(true, "Информация обновлена"),
                    );
                  })
                  .catch(() => {
                    tapticNotification("error");
                    this.setState({
                      snackbar: snackUpdated(false, "Произошла ошибка"),
                    });
                  })
                  .finally(() => {
                    this.props.router.replacePopup(null);
                  });
              } else {
                this.setState({
                  snackbar: snackUpdated(false, "Заполните все поля о себе"),
                });
              }
            },
          },
        ]}
      >
        <InterestsPick />
        <Textarea
          onChange={(e) => this.props.setAbout(e.target.value)}
          value={this.props.about}
          onBlur={(e) => this.props.setAbout(e.target.value.trim())}
          top="О себе"
          maxLength="140"
          className="about-textarea"
          placeholder="Здесь ты можешь оставить любую информацию о себе, которая будет полезна участникам"
        />
        {this.state.snackbar}
      </ModalCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    colorScheme: state.data.colorScheme,
    notifications: state.data.notifications,
    about: state.data.about,
    interests: state.data.interests,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ setInterests, setSnackbar, setAbout }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AboutCard));
