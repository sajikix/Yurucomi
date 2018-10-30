import React from "react";
import socket from "./socket";
import SessionCheckModal from "./sessionCheckModal";
import { RouteComponentProps } from "react-router-dom";
type Props = RouteComponentProps<{ groupName: string }>;

type State = {
  eventList: Array<EventInfo>;
};

type EventInfo = {
  with: Array<string>;
  tuple: any;
};

export default class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eventList: [],
    };
  }

  connect() {
    socket.emit("join-tuple-space", {
      tupleSpace: this.props.match.params.groupName,
    });

    socket.on("msg", (data: any) => {
      const newEventList: Array<EventInfo> = [
        { with: data.to, tuple: data.tuple },
        ...this.state.eventList,
      ];
      this.setState({ eventList: newEventList });
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
                return <ul>{JSON.stringify(value.with)}</ul>;
              })}
            </div>
          </div>
        )}
      />
    );
  }
}
