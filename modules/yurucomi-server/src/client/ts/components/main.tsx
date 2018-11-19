import React from "react";
import SessionCheckModal from "./sessionCheckModal";
import { RouteComponentProps } from "react-router-dom";
import Userpage from "./userPage";
type Props = RouteComponentProps<{ groupName: string }>;

export default class Main extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <SessionCheckModal
        renderIfChecked={userName => (
          <Userpage
            userName={userName}
            groupName={this.props.match.params.groupName}
          />
        )}
      />
    );
  }
}
