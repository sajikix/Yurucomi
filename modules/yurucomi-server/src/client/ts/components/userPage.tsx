import React from "react";
import io from "socket.io-client";
import {
  Tuple,
  Callback,
  ResponseTuple,
  ConnectCallback,
} from "../interfaces/index";
import EventWatcher from "../eventWatcher";
import getIcon from "../getIcon";
import SlideMenu from "./slideMenu";

type Props = {
  hideSlideMenu: boolean;
  groupName: string;
  userName: string;
};

type State = {
  eventList: Array<EventInfo>;
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
    this.state = { eventList: [], reconnecting: false };
    this.connect = this.connect.bind(this);
    this.addWatchTuple = this.addWatchTuple.bind(this);
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  connect() {
    const watcher = new EventWatcher();
    watcher.listen(this.props.groupName);
    watcher.watch(this.props.userName, async data => {
      // const iconUrl = await getIcon(this.props.groupName, this.props.userName);
      const newList = [
        { from: data._from, tuple: data._payload, fromImage: data._fromIcon },
        ...this.state.eventList,
      ];

      console.log(newList);
      this.setState({ eventList: newList });
    });
  }

  componentDidMount() {
    this.connect();
  }

  componentDidUpdate() {}

  addWatchTuple(tuple: Tuple) {
    this.socket.emit("_watch_operation", {
      tsName: this.props.groupName,
      payload: tuple,
    });
  }
  render() {
    return (
      <div className={"user-page"}>
        {!this.props.hideSlideMenu && <SlideMenu />}
        <div className={"events"}>
          {this.state.eventList.map((value: any) => {
            return (
              <div className={"event-child"}>
                <div className={"from-icon"}>
                  <img src={value.fromImage} alt="" />
                </div>
                <div className={"tuple-area"}>
                  <div className={"tuple"}>{JSON.stringify(value.tuple)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
