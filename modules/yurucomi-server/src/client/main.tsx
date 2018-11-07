import React from "react";
import socket from "./socket";
import SessionCheckModal from "./sessionCheckModal";
import { RouteComponentProps } from "react-router-dom";
import LindaClient from "./lindaClient";
type Props = RouteComponentProps<{ groupName: string }>;

type State = {
  eventList: any;
  reconnecting: boolean;
};

type EventInfo = {
  with: Array<string>;
  tuple: any;
};

export default class Main extends React.Component<Props, State> {
  // socket: SocketIOClient.Socket;
  constructor(props: Props) {
    super(props);
    this.state = {
      eventList: [],
      reconnecting: false,
    };
    this.connect = this.connect.bind(this);
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  connect() {
    //const socket = io(location.origin, options);
    // socket.emit("join-tuple-space", {
    //   tupleSpace: this.props.match.params.groupName,
    // });

    // socket.on("msg", (data: any) => {
    //   const newEventList: Array<EventInfo> = [
    //     { with: data.to, tuple: data.tuple },
    //     ...this.state.eventList,
    //   ];
    //   this.setState({ eventList: newEventList });
    // });
    const lindaClient = new LindaClient(this.props.match.params.groupName);
    lindaClient.connect(socket => {
      lindaClient.watch({}, socket, data => {
        const newEventList = [data, ...this.state.eventList];
        this.setState({ eventList: newEventList });
      });
    });
  }

  componentDidMount() {
    this.connect();
  }

  render() {
    return (
      <SessionCheckModal
        renderIfChecked={userName => (
          <div>
            {this.props.match.params.groupName + "/" + JSON.stringify(userName)}
            <div>
              {this.state.eventList.map(value => {
                return <ul>{JSON.stringify(value)}</ul>;
              })}
            </div>
          </div>
        )}
      />
    );
  }
}