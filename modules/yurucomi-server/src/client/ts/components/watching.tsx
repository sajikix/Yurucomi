import React from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { Setting } from "yurucomi-interfaces";
import { getWatchingFromLocalData } from "../utils/localStorage";

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
    this.state = { watchingList: [], reconnecting: false };
    this.getWatching = this.getWatching.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  validate(nameArray: Array<string>, myName: string) {
    const result = nameArray.filter(n => n !== myName);
    return result;
  }

  getWatching() {
    const settingArray = getWatchingFromLocalData(this.props.groupName);
    console.log(settingArray);
    this.setState({ watchingList: settingArray });
  }

  componentDidMount() {
    this.getWatching();
  }

  changeState(index1: number, index2: number) {
    const oldState = this.state.watchingList;
    console.log(index1, index2);
    if (index2 < 0) {
      oldState[index1].checked = !oldState[index1].checked;
      for (let i = 0; i < oldState[index1].values.length; i++) {
        oldState[index1].values[i].checked = oldState[index1].checked;
      }
      console.log(oldState);
      this.setState({ watchingList: oldState });
    } else {
      oldState[index1].values[index2].checked = !oldState[index1].values[index2]
        .checked;
      this.setState({ watchingList: oldState });
    }
    localStorage.setItem(
      this.props.groupName,
      JSON.stringify(this.state.watchingList)
    );
  }

  render() {
    return (
      <PageWrapper>
        {this.state.watchingList.map((ele, index) => {
          return (
            <WatchingNode>
              <WatchingKey>
                <RadioWrapper
                  checked={ele.checked}
                  onClick={e => this.changeState(index, -1)}
                >
                  <Radio src={"./images/check.png"} />
                </RadioWrapper>
                <KeyText>{ele.key}</KeyText>
              </WatchingKey>
              {ele.values.map((e, i) => {
                return (
                  <WatchingValue>
                    <ValueRadioWrapper
                      checked={e.checked}
                      onClick={e => this.changeState(index, i)}
                    >
                      <Radio src={"./images/check.png"} />
                    </ValueRadioWrapper>
                    <ValueText>{e.value}</ValueText>
                  </WatchingValue>
                );
              })}
            </WatchingNode>
          );
        })}
      </PageWrapper>
    );
  }
}

const RadioWrapper = styled.div<{ checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.checked ? "rgba(234, 0, 0, 1)" : "rgba(255,255,255,1)"};
  height: 1.6vw;
  width: 1.6vw;
  border-style: solid;
  border-width: 1px;
  border-color: ${props =>
    props.checked ? "rgba(234, 0, 0, 1)" : "rgba(118, 118, 118, 1)"};
  border-radius: 50%;
`;

const ValueRadioWrapper = styled.div<{ checked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.checked ? "rgba(234, 0, 0, 1)" : "rgba(255,255,255,1)"};
  height: 1.4vw;
  width: 1.4vw;
  border-style: solid;
  border-width: 1px;
  border-color: ${props =>
    props.checked ? "rgba(234, 0, 0, 1)" : "rgba(118, 118, 118, 1)"};
  border-radius: 50%;
`;

const WatchingValue = styled.div`
  display: flex;
  align-items: center;
  margin-left: 3vw;
`;

const ValueText = styled.div`
  margin-left: 1vw;
  font-size: 4vh;
  color: rgba(118, 118, 118, 1);
`;

const KeyText = styled.div`
  font-size: 5vh;
  margin-left: 1vw;
  color: rgba(118, 118, 118, 1);
`;

const Radio = styled.img`
  height: 90%;
  width: 90%;
`;
const WatchingNode = styled.div`
  margin-top: 2vh;
`;

const WatchingKey = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PageWrapper = styled.div`
  width: 80vw;
  display: flex;
  flex-direction: column;
  padding-top: 1vh;
  padding-left: 2vw;
`;
