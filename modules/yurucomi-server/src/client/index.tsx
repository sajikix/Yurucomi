import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Home from "./home";
import Main from "./main";
import Login from "./login";

//type Props = {};

const Root = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/_login" component={Login} />
      <Route path="/:groupName" component={Main} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById("root"));
