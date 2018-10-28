import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Home from "./home";
import Main from "./Main";

type Props = {};

const Root = (props: Props) => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/:groupName" component={Main} />
    </div>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById("root"));
