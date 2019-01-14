import React from "react";
import io from "socket.io-client";
import YurucomiClient from "../yurucomiClient";
import {
  setTmpToLocalData,
  getEvetsFromLocalData,
} from "../utils/localStorage";
import { transfromDate } from "../utils/transformDate";
import { shortningTuple, showFullTuple } from "../utils/showTuple";
import { YurucomiEvent, Tuple } from "yurucomi-interfaces";
import styled from "styled-components";

type Props = {
  groupName: string;
  userName: string;
  showEventDetail: (pageName: string, data: YurucomiEvent) => void;
};

type State = {
  eventList: Array<YurucomiEvent>;
  reconnecting: boolean;
  showDetail: Array<string>;
};

export default class Events extends React.Component<Props, State> {
  socket: SocketIOClient.Socket;
  yurucomiClient: YurucomiClient;
  constructor(props: Props) {
    super(props);
    this.socket = io(location.origin);
    this.yurucomiClient = new YurucomiClient();
    this.state = { eventList: [], reconnecting: false, showDetail: [] };
    this.connect = this.connect.bind(this);
    this.switchDetail = this.switchDetail.bind(this);
    this.showingDetail = this.showingDetail.bind(this);
  }

  connect() {
    this.yurucomiClient.listen(this.props.groupName, this.props.userName);
    this.yurucomiClient.getTmpData(data => {
      if (data.length > 0) {
        const events = setTmpToLocalData(this.props.groupName, data);
        console.log(data);
        this.setState({ eventList: events });
      } else {
        const events = getEvetsFromLocalData(this.props.groupName);
        console.log(data);
        this.setState({ eventList: events });
      }
    });
    this.yurucomiClient.watch(event => {
      const newList = [event, ...this.state.eventList];
      this.setState({ eventList: newList });
    });
  }

  switchDetail(id: string) {
    const array = this.state.showDetail;
    if (this.state.showDetail.includes(id)) {
      const filtered = array.filter(ele => {
        return ele !== id;
      });
      this.setState({ showDetail: filtered });
    } else {
      const inserted = [...array, id];
      this.setState({ showDetail: inserted });
    }
  }

  showingDetail(id: string) {
    return this.state.showDetail.includes(id);
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.yurucomiClient.disconnect();
  }

  render() {
    return (
      <div className={"events"}>
        {this.state.eventList.map((value: YurucomiEvent) => {
          return (
            <EventChild
              tuple={value._payload}
              showingDetail={this.showingDetail(value._id)}
              onClick={e => {
                console.log(value._id);
                this.props.showEventDetail("eventDetail", value);
              }}
            >
              <FromIconWrapper>
                <Icon src={value._fromIcon} alt="" />
              </FromIconWrapper>
              <Tuple>{shortningTuple(value._payload)}</Tuple>
              <TimeStamp>{transfromDate(value._time)}</TimeStamp>
            </EventChild>
          );
        })}
      </div>
    );
  }
}

const EventChild = styled.div<{
  showingDetail: boolean;
  tuple: Tuple;
}>`
  border-bottom: rgb(236, 239, 242) solid 1px;
  height: ${props =>
    props.showingDetail
      ? Math.ceil(JSON.stringify(props.tuple).length / 50) * 8
      : 8}vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FromIconWrapper = styled.div`
  height: 6.4vh;
  margin-left: 2vw;
  margin-right: 2vw;
`;

const Tuple = styled.div`
  font-size: 3.2vh;
  color: rgba(118, 118, 118, 1);
  flex-grow: 1;
`;

const TupleLine = styled.div<{
  needSpace: boolean;
}>`
  margin-left: ${props => (props.needSpace ? 2 : 0)}vw;
`;
const TimeStamp = styled.div`
  font-size: 2.4vh;
  color: rgba(118, 118, 118, 1);
  margin-right: 1vw;
`;

const Icon = styled.img`
  border-radius: 50%;
  margin-top: 5%;
  height: 90%;
  background-color: rgb(161, 174, 187);
`;
