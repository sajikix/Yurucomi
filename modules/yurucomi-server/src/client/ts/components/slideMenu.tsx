import React from "react";
import styled from "styled-components";
type Props = {
  changePage: (pageName: string) => void;
  pageName: string;
};
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
        <MenuChild
          onClick={e => {
            this.props.changePage("events");
          }}
          selected={
            this.props.pageName == "events" ||
            this.props.pageName == "eventDetail"
          }
        >
          <MenuTitle>{"Events"}</MenuTitle>
        </MenuChild>
        <MenuChild
          selected={this.props.pageName == "watching"}
          onClick={e => {
            this.props.changePage("watching");
          }}
        >
          <MenuTitle>{"Watching"}</MenuTitle>
        </MenuChild>
        <MenuChild selected={this.props.pageName == "members"}>
          <MenuTitle>{"Members"}</MenuTitle>
        </MenuChild>
        <Empty />
        <MenuChild
          selected={this.props.pageName == "top"}
          onClick={() => {
            window.location.href = location.origin;
          }}
        >
          <MenuTitle>{"Top"}</MenuTitle>
        </MenuChild>
        <MenuChild
          selected={this.props.pageName == "logout"}
          onClick={() => {
            this.logout();
          }}
        >
          <MenuTitle>{"Logout"}</MenuTitle>
        </MenuChild>
      </div>
    );
  }
}

const Empty = styled.div`
  width: 19vw;
  background-color: rgba(255, 255, 255, 0);
  height: 5vh;
  border-radius: 0 2vh 2vh 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3vh;
`;

const MenuChild = styled.div<{
  selected: boolean;
}>`
  width: 19vw;
  background-color: ${props =>
    props.selected ? "rgb(256, 230, 230);" : "white"};
  color: ${props =>
    props.selected ? "rgba(234, 0, 0, 1)" : "rgba(118, 118, 118, 1)"};
  height: 5vh;
  border-radius: 0 2vh 2vh 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3vh;
  :hover {
    background-color: ${props =>
      props.selected ? "rgb(255, 230, 230)" : "rgb(236, 239, 242)"};
  }
`;

const MenuTitle = styled.div`
  font-size: 3vh;
`;

export default SlideMenu;
