import React from "react";
import { showFullTuple } from "../utils/showTuple";
import { YurucomiEvent, Tuple } from "yurucomi-interfaces";
import { transfromDate } from "../utils/transformDate";
import styled from "styled-components";

type Props = {
  groupName: string;
  userName: string;
  changePage: (pageName: string) => void;
  data: YurucomiEvent;
};

type State = {
  eventList: Array<YurucomiEvent>;
  reconnecting: boolean;
  showDetail: Array<string>;
};

export default class Events extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { eventList: [], reconnecting: false, showDetail: [] };
  }

  componentDidMount() {}

  render() {
    return (
      <EventDetailPage>
        <DetailHeadder>
          <HeadderTitle onClick={e => this.props.changePage("events")}>
            {"< 戻る"}
          </HeadderTitle>
        </DetailHeadder>

        <Detail>
          <DetailTitle>{"・Tuple"}</DetailTitle>
          <DetailContent>
            {showFullTuple(this.props.data._payload).map(ele => {
              return <EventLine needSpace={ele.space}>{ele.value}</EventLine>;
            })}
          </DetailContent>
          <DetailTitle>{"・From"}</DetailTitle>
          <DetailContent>{this.props.data._from}</DetailContent>
          <DetailTitle>{"・Time"}</DetailTitle>
          <DetailContent>{transfromDate(this.props.data._time)}</DetailContent>
          <DetailTitle>{"・With"}</DetailTitle>
          <DetailContent>
            {this.props.data._matchedUsers.map(ele => {
              return <WithMember>{ele + ","}</WithMember>;
            })}
          </DetailContent>
        </Detail>
      </EventDetailPage>
    );
  }
}

const Detail = styled.div`
  color: rgba(118, 118, 118, 1);
`;

const WithMember = styled.span`
  margin-left: 1vw;
`;

const DetailTitle = styled.div`
  font-size: 3.2vh;
  margin-left: 1vw;
  margin-top: 2vh;
`;

const DetailContent = styled.div`
  font-size: 2.7vh;
  margin-bottom: 1vh;
  margin-left: 3vw;
`;

const EventDetailPage = styled.div`
  width: 80vw;
`;

const EventLine = styled.div<{
  needSpace: number;
}>`
  margin-left: ${props => props.needSpace * 2}vw;
`;

const HeadderTitle = styled.div`
  color: rgba(118, 118, 118, 1);
  font-size: 3vh;
  margin-left: 1.5vw;
  border-radius: 2vh;
  padding-left: 1vw;
  padding-right: 1vw;
  :hover {
    background-color: rgb(236, 239, 242);
  }
`;

const DetailHeadder = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: rgb(236, 239, 242) solid 1px;
  width: 100%;
  height: 7vh;
`;
