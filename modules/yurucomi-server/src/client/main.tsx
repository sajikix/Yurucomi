import React from "react";
import SessionCheckModal from "./sessionCheckModal";
import { RouteComponentProps } from "react-router-dom";
type Props = RouteComponentProps<{ groupName: string }>;

const Main = (props: Props) => (
  <SessionCheckModal
    renderIfChecked={userName => (
      <div>{props.match.params.groupName + "/" + JSON.stringify(userName)}</div>
    )}
  />
);

export default Main;
