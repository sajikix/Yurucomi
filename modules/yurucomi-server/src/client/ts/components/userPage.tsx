import React from "react";
import SlideMenu from "./slideMenu";
import Events from "./events";
import EventDetail from "./eventDetail";
import Watching from "./watching";
import { YurucomiEvent } from "yurucomi-interfaces";

type Props = {
  hideSlideMenu: boolean;
  groupName: string;
  userName: string;
};

type State = {
  pageName: string;
  eventData: YurucomiEvent;
};

export default class UserPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageName: "events",
      eventData: {
        _from: null,
        _fromIcon: null,
        _matchedUsers: null,
        _payload: {},
        _time: 0,
        _where: null,
      },
    };
    this.changePage = this.changePage.bind(this);
    this.showEventDetail = this.showEventDetail.bind(this);
  }

  changePage(pageName: string) {
    this.setState({ pageName });
  }

  showEventDetail(pageName: string, data: YurucomiEvent) {
    this.setState({ pageName, eventData: data });
  }

  render() {
    return (
      <div className={"user-page"}>
        {!this.props.hideSlideMenu && (
          <SlideMenu
            changePage={this.changePage}
            pageName={this.state.pageName}
          />
        )}
        {this.state.pageName === "eventDetail" && (
          <EventDetail
            groupName={this.props.groupName}
            userName={this.props.userName}
            data={this.state.eventData}
            changePage={this.changePage}
          />
        )}
        {this.state.pageName === "events" && (
          <Events
            groupName={this.props.groupName}
            userName={this.props.userName}
            showEventDetail={this.showEventDetail}
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
