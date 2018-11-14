import React, { ReactNode } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";

type Props = {
  renderIfChecked: (userName: string) => ReactNode;
};

type State = {
  fetching: boolean;
  sessionChecked: boolean;
  userName: string;
};

const here: string = location.protocol + "//" + location.host;

export default class sessionCheckModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fetching: true,
      sessionChecked: false,
      userName: "",
    };
    // bind "this"
    this.fetchSession = this.fetchSession.bind(this);
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
    if (this.state.sessionChecked || true) {
      return <div>{this.props.renderIfChecked(this.state.userName)}</div>;
    }
  }
}
