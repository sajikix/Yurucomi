import React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import Headder from "./headder";

type State = {
  hasError: boolean;
  sessionChecked: boolean;
  inputUserName: string;
  inputGroupName: string;
  errorMes: string;
  initialUser: boolean;
  initialGroup: boolean;
};

type Props = RouteComponentProps;

const here: string = location.protocol + "//" + location.host;

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      initialUser: true,
      initialGroup: true,
      hasError: false,
      errorMes: "",
      sessionChecked: false,
      inputUserName: "User Name ...",
      inputGroupName: "Group Name ...",
    };

    this.login = this.login.bind(this);
    this.changeUserName = this.changeUserName.bind(this);
    this.changeGroupName = this.changeGroupName.bind(this);
    this.initialUserFocus = this.initialUserFocus.bind(this);
    this.initialGroupFocus = this.initialGroupFocus.bind(this);
    this.GNameCheck = this.GNameCheck.bind(this);
    this.UNameCheck = this.UNameCheck.bind(this);
  }

  changeUserName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      inputUserName: event.target.value,
    });
  }
  changeGroupName(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      inputGroupName: event.target.value,
    });
  }

  GNameCheck() {
    if (this.state.inputGroupName === "") {
      this.setState({ initialGroup: true, inputGroupName: "Group Name ..." });
    }
  }

  UNameCheck() {
    if (this.state.inputUserName === "") {
      this.setState({ initialUser: true, inputUserName: "User Name ..." });
    }
  }

  initialUserFocus() {
    this.setState({ errorMes: "" });
    if (this.state.initialUser) {
      this.setState({
        inputUserName: "",
        initialUser: false,
      });
    }
  }

  initialGroupFocus() {
    this.setState({ errorMes: "" });
    if (this.state.initialGroup) {
      this.setState({
        inputGroupName: "",
        initialGroup: false,
      });
    }
  }

  getParam(name: string) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  componentDidMount() {
    const groupName = this.getParam("where");
    if (groupName) {
      this.setState({
        inputGroupName: groupName,
        initialGroup: false,
      });
    }
  }

  async login() {
    try {
      console.log("login");
      const response = await fetch(here + "/_login", {
        method: "POST",
        body: JSON.stringify({
          userName: this.state.inputUserName.toLowerCase(),
          groupName: this.state.inputGroupName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { result } = await response.json();
      if (result) {
        this.setState({ sessionChecked: true });
      } else {
        this.setState({
          hasError: true,
          errorMes: "login faild",
        });
      }
    } catch (e) {
      this.setState({
        hasError: true,
        errorMes: "network error",
      });
    }
  }

  render() {
    if (this.state.sessionChecked) {
      return <Redirect to={`/${this.state.inputGroupName}`} />;
    }

    return (
      <div id={"view-area"}>
        <Headder
          switchSlideMenu={() => {}}
          userName={"Yurucomi"}
          userIcon={"./images/setting.png"}
          groupName={this.getParam("where") || "Yurucomi"}
          loggedIn={false}
        />
        <div className={"login"}>
          <div className={"caption-area"}>
            <div className={"caption"}>{"Please Login"}</div>
          </div>
          <div className={"error-area"}>
            <div className={"error"}>
              {this.state.hasError ? this.state.errorMes : ""}
            </div>
          </div>
          <div className={"input-area"}>
            <div className={"input-area-child"}>
              <div className={"input-caption"}>{"GroupName"}</div>
              <div className={"input-back"}>
                <input
                  className={this.state.initialGroup ? "initial" : ""}
                  value={this.state.inputGroupName}
                  type="text"
                  onChange={this.changeGroupName}
                  onFocus={this.initialGroupFocus}
                  onBlur={this.GNameCheck}
                />
              </div>
            </div>
            <div className={"input-area-child"}>
              <div className={"input-caption"}>{"UserName"}</div>
              <div className={"input-back"}>
                <input
                  className={this.state.initialUser ? "initial" : ""}
                  value={this.state.inputUserName}
                  type="text"
                  onChange={this.changeUserName}
                  onFocus={this.initialUserFocus}
                  onBlur={this.UNameCheck}
                />
              </div>
            </div>
          </div>
          <div className={"button-area"}>
            <div className={"button"} onClick={this.login}>
              <span>{"Login"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export default withHeadder(Login);
