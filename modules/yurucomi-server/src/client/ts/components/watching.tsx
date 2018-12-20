import React from "react";
import io from "socket.io-client";
import YurucomiClient from "../yurucomiClient";
import SlideMenu from "./slideMenu";
import { Setting } from "yurucomi-interfaces";

type Props = {
  groupName: string;
  userName: string;
};

type State = {
  watchingList: any;
  reconnecting: boolean;
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
    this.socket = io(location.origin);
    this.state = { watchingList: {}, reconnecting: false };
    this.getWatching = this.getWatching.bind(this);
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  getWatching() {
    const setting: Setting = JSON.parse(
      localStorage.getItem(this.props.groupName) || "{}"
    );
    const settingArray = Object.entries(setting);
    this.setState({ watchingList: settingArray });
  }

  componentDidMount() {
    //this.connect();
    // this.getWatching();
  }

  componentDidUpdate() {}

  render() {
    return (
      <div className={"events"}>
        <div>{"aaaaaa"}</div>
      </div>
    );
  }
}
