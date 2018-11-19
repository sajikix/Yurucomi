import React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";

type State = {
  hasError: boolean;
  sessionChecked: boolean;
  inputName: string;
  errorMes: string;
};

type Props = RouteComponentProps;

const here: string = location.protocol + "//" + location.host;

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      errorMes: "",
      sessionChecked: false,
      inputName: "",
    };

    this.login = this.login.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  changeText(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputName: event.target.value });
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

  async login() {
    try {
      console.log("login");
      const response = await fetch(here + "/_login", {
        method: "POST", // or 'PUT'
        body: JSON.stringify({ userName: this.state.inputName }), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { result } = await response.json();
      if (result) {
        this.setState({ sessionChecked: true });
      } else {
        this.setState({ hasError: true, errorMes: "login faild" });
      }
    } catch (e) {
      this.setState({ hasError: true, errorMes: "network error" });
    }
  }

  render() {
    if (this.state.sessionChecked) {
      return <Redirect to={`/${this.getParam("where")}`} />;
    }

    return (
      <div className={"login"}>
        <p>{"enter your name"}</p>
        <input type="text" onChange={this.changeText} />
        {this.state.hasError && (
          <p style={{ color: "red" }}>{this.state.errorMes}</p>
        )}
        <button onClick={this.login} value={"login"} />
      </div>
    );
  }
}
