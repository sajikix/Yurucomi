import React from "react";
import io from "socket.io-client";
import {
  Tuple,
  Callback,
  ResponseTuple,
  ConnectCallback,
} from "./interfaces/index";
import EventWatcher from "./eventWatcher";

type Props = { groupName: string; userName: string };

type State = {
  eventList: any;
  reconnecting: boolean;
};

type EventInfo = {
  with: Array<string>;
  tuple: any;
};

export default class Main extends React.Component<Props, State> {
  socket: SocketIOClient.Socket;
  constructor(props: Props) {
    super(props);
    this.socket = io("http://localhost:3000");
    this.state = { eventList: [], reconnecting: false };
    this.connect = this.connect.bind(this);
    this.addWatchTuple = this.addWatchTuple.bind(this);
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  connect() {
    // const tupleSpaceName = this.props.groupName;
    // this.socket.emit("_join_tuplespace", {
    //   tsName: tupleSpaceName,
    // });
    // this.socket.on("_watch_response", (resData: ResponseTuple) => {
    //   console.log("watched");
    //   const newEventList = [resData, ...this.state.eventList];
    //   this.setState({
    //     eventList: newEventList,
    //   });
    // });
    // this.socket.emit("_get_my_props_settings", { tsName: "masuilab" });
    // this.socket.on("_res_props_settings", (res: any) => {
    //   console.log(res);
    // });
    // this.socket.on("_settings_update", (res: any) => {
    //   console.log(res);
    // });
    const watcher = new EventWatcher();
    watcher.listen(this.props.groupName);
    watcher.watch(data => {
      const newList = [data, ...this.state.eventList];
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
      <div>
        {this.props.groupName + "/" + JSON.stringify(this.props.userName)}
        <div>
          {this.state.eventList.map((value: any) => {
            return <ul>{JSON.stringify(value)}</ul>;
          })}
        </div>
      </div>
    );
  }
}
