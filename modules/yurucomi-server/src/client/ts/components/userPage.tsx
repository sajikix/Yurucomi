import React from "react";
import io from "socket.io-client";
import YurucomiClient from "../yurucomiClient";
import SlideMenu from "./slideMenu";
import Events from "./events";
import Watching from "./watching";

type Props = {
  hideSlideMenu: boolean;
  groupName: string;
  userName: string;
};

type State = {
  pageName: string;
};

type EventInfo = {
  from: string;
  fromImage: string;
  tuple: any;
};

export default class UserPage extends React.Component<Props, State> {
  socket: SocketIOClient.Socket;
  constructor(props: Props) {
    super(props);
    this.state = {
      pageName: "events",
    };
    this.socket = io(location.origin);
    this.changePage = this.changePage.bind(this);
  }

  changePage(pageName: string) {
    this.setState({ pageName });
  }

  render() {
    return (
      <div className={"user-page"}>
        {!this.props.hideSlideMenu && (
          <SlideMenu changePage={this.changePage} />
        )}
        {this.state.pageName === "events" && (
          <Events
            groupName={this.props.groupName}
            userName={this.props.userName}
          />
        )}
        {this.state.pageName === "watching" && (
          <Watching
            groupName={this.props.groupName}
            userName={this.props.userName}
          />
        )}
      </div>
    );
  }
}
