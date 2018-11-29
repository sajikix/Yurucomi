import React from "react";
type Props = {};
type State = {};

const here: string = location.protocol + "//" + location.host;

class SlideMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  async logout() {
    try {
      const response = await fetch(here + "/_logout");
      const resData = await response.json();
      if (resData.logouted) {
        window.location.href = location.origin + "/_login";
      }
    } catch (e) {}
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

        <div
          className={"menu-child"}
          onClick={() => {
            window.location.href = location.origin;
          }}
        >
          <div className={"menu-title"}>{"Top"}</div>
        </div>
        <div
          className={"menu-child"}
          onClick={() => {
            this.logout();
          }}
        >
          <div className={"menu-title"}>{"Logout"}</div>
        </div>
      </div>
    );
  }
}

export default SlideMenu;
