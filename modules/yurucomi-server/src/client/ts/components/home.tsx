import React from "react";
import withHeadder from "./withHeadder";
import { Redirect } from "react-router-dom";
import "../../css/components/home.scss";
type Props = {};
type State = {
  textInput: string;
  redirect: boolean;
};

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      textInput: "CommunityName",
      redirect: false,
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.toCommunity = this.toCommunity.bind(this);
  }
  onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ textInput: e.target.value });
  }
  toCommunity() {
    //CSnameのバリデーションいるかも
    if (this.state.textInput) {
      this.setState({ redirect: true });
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/${this.state.textInput}`} />;
    }
    return (
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
    );
  }
}

export default withHeadder(Home);
