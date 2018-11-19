import React from "React";
import Headder from "./headder";
import { RouteComponentProps } from "react-router-dom";

type Props = RouteComponentProps<{ groupName?: string }>;
type State = {};

const withHeadder = <P extends object>(
  ComposedComponent: React.ComponentType<P>
) => {
  return class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
    }
    render() {
      return (
        <div id={"view-area"}>
          <Headder />
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  };
};

export default withHeadder;
