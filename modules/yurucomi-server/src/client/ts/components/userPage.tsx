import React from "react";
import io from "socket.io-client";
import YurucomiClient from "../yurucomiClient";
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
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  connect() {
    const yurucomiClient = new YurucomiClient();
    yurucomiClient.listen(this.props.groupName, this.props.userName);
    yurucomiClient.watch(event => {
      const newList = [
        {
          from: event._from,
          tuple: event._payload,
          fromImage: event._fromIcon,
        },
        ...this.state.eventList,
      ];
      this.setState({ eventList: newList });
    });
  }

  componentDidMount() {
    this.connect();
  }

  componentDidUpdate() {}

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
