import React, { ReactNode } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import Headder from "./headder";
import Loading from "./loading";

type Props = {
  renderIfChecked: (userName: string, userIcon: string) => ReactNode;
  groupName: string;
};

type State = {
  fetching: boolean;
  sessionChecked: boolean;
  userName: string;
  userIcon: string;
};

const here: string = location.protocol + "//" + location.host;

export default class sessionCheckModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fetching: true,
      sessionChecked: false,
      userName: "",
      userIcon: "",
    };
    // bind "this"
    this.fetchSession = this.fetchSession.bind(this);
  }

  async fetchSession() {
    const response = await fetch(here + "/_sessioncheck");
    const { result, name, icon } = await response.json();
    if (result) {
      console.log();
      this.setState({ userName: name, sessionChecked: true, userIcon: icon });
    }
    this.setState({ fetching: false });
  }

  componentDidMount() {
    this.fetchSession();
  }

  render() {
    if (this.state.fetching) {
      return (
        <div id={"view-area"}>
          <Headder
            switchSlideMenu={() => {}}
            userName={"Yurucomi"}
            userIcon={"./images/setting.png"}
            groupName={this.props.groupName}
            loggedIn={false}
          />
          <Loading />
        </div>
      );
    }
    if (this.state.sessionChecked || true) {
      return (
        <div className={"session-check-modal"}>
          {this.props.renderIfChecked(this.state.userName, this.state.userIcon)}
        </div>
      );
    }
  }
}
