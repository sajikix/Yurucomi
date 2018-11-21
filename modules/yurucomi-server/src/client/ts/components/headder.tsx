import React from "react";

type Props = {
  userName: string;
  userIcon: string;
  groupName: string;
  loggedIn: boolean;
  switchSlideMenu: () => void;
};
type State = {
  iconURL: string;
  menuImage: string;
};

class Headder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      iconURL: "",
      menuImage: "./images/menu.png",
    };
  }
  render() {
    return (
      <div className={"headder"}>
        <div className={"menu-back"}>
          <div
            className={"menu"}
            onMouseDown={() => {
              this.setState({ menuImage: "./images/menu-reverse.png" });
            }}
            onMouseUp={() => {
              this.setState({ menuImage: "./images/menu.png" });
            }}
            onClick={this.props.switchSlideMenu}
          >
            <img src={this.state.menuImage} alt="menu-icon" />
          </div>
        </div>
        <div className={"title"}>{this.props.groupName}</div>
        <div className={"setting"}>
          {!this.props.loggedIn ? (
            <img
              className={"setting-icon"}
              src="./images/setting.png"
              alt="setting-icon"
            />
          ) : (
            <img className={"user-icon"} src={this.props.userIcon} />
          )}
        </div>
      </div>
    );
  }
}

export default Headder;
