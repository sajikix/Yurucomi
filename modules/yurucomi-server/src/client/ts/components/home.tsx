import React from "react";
import { Redirect } from "react-router-dom";
import "../../css/components/home.scss";
import Headdder from "./headder";
type Props = {};
type State = {
  initial: boolean;
  textInput: string;
  redirect: boolean;
};

export default class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      textInput: "CommunityName",
      redirect: false,
      initial: true,
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.toCommunity = this.toCommunity.bind(this);
    this.initialFocus = this.initialFocus.bind(this);
  }
  onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ textInput: e.target.value });
  }
  toCommunity() {
    //CSnameのバリデーションいるかも
    if (this.state.textInput && !this.state.initial) {
      this.setState({ redirect: true });
    }
  }
  initialFocus() {
    if (this.state.initial) {
      this.setState({ textInput: "", initial: false });
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/${this.state.textInput}`} />;
    }
    return (
      <div id={"view-area"}>
        <Headdder
          switchSlideMenu={() => {}}
          userIcon={"./images/settings.png"}
          userName={"Yurucomi"}
          groupName={"Yurucomi"}
          loggedIn={false}
        />
        <div className={"home"}>
          <div className={"caption-area"}>
            <div className={"caption"}>{"Enter your community name"}</div>
          </div>
          <div className={"input-area"}>
            <div className={"input-area-child"}>
              <div className={"input-back"}>
                <input
                  value={this.state.textInput}
                  type="text"
                  onChange={this.onTextChange}
                  onFocus={this.initialFocus}
                />
              </div>
              <div className={"button"} onClick={this.toCommunity}>
                <span>{"Go"}</span>
              </div>
            </div>
          </div>
          <div className={"link-area"}>
            <a href="https://github.com/saji-ryu/Yurucomi">github</a>
          </div>
        </div>
      </div>
    );
  }
}
