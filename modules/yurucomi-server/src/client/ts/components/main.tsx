import React from "react";
import SessionCheckModal from "./sessionCheckModal";
import { RouteComponentProps } from "react-router-dom";
import Userpage from "./userPage";
import Headder from "./headder";

type Props = RouteComponentProps<{ groupName: string }>;
type State = {
  hideSlideMenu: boolean;
};

export default class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hideSlideMenu: false,
    };
    this.switchSlideMenu = this.switchSlideMenu.bind(this);
  }

  switchSlideMenu() {
    this.setState({
      hideSlideMenu: !this.state.hideSlideMenu,
    });
  }

  render() {
    return (
      <SessionCheckModal
        groupName={this.props.match.params.groupName}
        renderIfChecked={(userName, userIcon) => (
          <div id={"view-area"}>
            <Headder
              switchSlideMenu={this.switchSlideMenu}
              userIcon={userIcon}
              userName={userName}
              groupName={this.props.match.params.groupName}
              loggedIn={true}
            />
            <Userpage
              hideSlideMenu={this.state.hideSlideMenu}
              userName={userName}
              groupName={this.props.match.params.groupName}
            />
          </div>
        )}
      />
    );
  }
}
