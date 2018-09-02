import React    from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import Nav                  from "./nav.js";
import HomePage             from "./HomePage.js";

require('offline-plugin/runtime').install();
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';
//
// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
// }
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

if (process.env.NODE_ENV != "production"){
  module.hot.accept();
}
