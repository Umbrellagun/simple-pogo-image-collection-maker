import React    from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import Nav                  from "./nav.js";
import HomePage             from "./HomePage.js";

// import styles from "./styles.js";

const $container = document.getElementById("container");

// <Route path="*" component={ConfirmationDialog}/>

// <Nav/>
ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={HomePage}/>

        <Route path="*" component={HomePage}/>
      </Switch>
    </div>
  </Router>, $container);

  module.hot.accept();
