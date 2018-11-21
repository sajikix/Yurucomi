import React from "react";

type Props = {};
type State = {};

class SlideMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={"slide-menu"}>
        <div className={"menu-child"} id={"selected"}>
          <div className={"menu-title"}>{"Events"}</div>
        </div>
        <div className={"menu-child"}>
          <div className={"menu-title"}>{"Watching"}</div>
        </div>
        <div className={"menu-child"}>
          <div className={"menu-title"}>{"Members"}</div>
        </div>
        <div className={"empty"}>
          <div className={"empty-text"}>{""}</div>
        </div>

        <div className={"menu-child"}>
          <div className={"menu-title"}>{"Top"}</div>
        </div>
        <div className={"menu-child"}>
          <div className={"menu-title"}>{"Logout"}</div>
        </div>
      </div>
    );
  }
}

export default SlideMenu;
