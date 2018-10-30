import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";

type Props = {
  renderIfChecked: (userName: string) => ReactNode;
};

type RouterProps = RouteComponentProps<{ gourName: string }>;

type State = {
  fetching: boolean;
  hasError: boolean;
  sessionChecked: boolean;
  inputName: string;
  userName: string;
  errorMes: string;
};

const here: string = location.protocol + "//" + location.host;

export default class sessionCheckModal extends React.Component<Props, State> {
  constructor(props: Props & RouterProps) {
    super(props);

    this.state = {
      fetching: true,
      hasError: false,
      errorMes: "",
      sessionChecked: false,
      inputName: "",
      userName: "",
    };
    // bind "this"
    this.login = this.login.bind(this);
    this.changeText = this.changeText.bind(this);
    this.fetchSession = this.fetchSession.bind(this);
  }

  changeText(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ inputName: event.target.value });
  }

  async login() {
    this.setState({ fetching: true });
    try {
      console.log("login");
      const response = await fetch(here + "/_login", {
        method: "POST", // or 'PUT'
        body: JSON.stringify({ userName: this.state.inputName }), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { result, name } = await response.json();
      if (result) {
        this.setState({ sessionChecked: true, userName: name });
      } else {
        this.setState({ hasError: true, errorMes: "login faild" });
      }
    } catch (e) {
      this.setState({ hasError: true, errorMes: "network error" });
    } finally {
      this.setState({ fetching: false });
    }
  }

  async fetchSession() {
    const response = await fetch(here + "/_sessioncheck");
    const { result, name } = await response.json();
    if (result) {
      this.setState({ userName: name, sessionChecked: true });
    }
    this.setState({ fetching: false });
  }

  componentDidMount() {
    this.fetchSession();
  }

  render() {
    if (this.state.fetching) {
      return <div>{"Loading"}</div>;
    }

    if (this.state.sessionChecked) {
      return <div>{this.props.renderIfChecked(this.state.userName)}</div>;
    }

    return (
      <div>
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
