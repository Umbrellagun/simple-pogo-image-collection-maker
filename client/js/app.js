import React    from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./HomePage.js";

import "../../bg_image.png";
import "../../site.webmanifest";

import "../../apple-touch-icon.png";
import "../../android-chrome-192x192.png";
import "../../favicon-16x16.png";
import "../../favicon-32x32.png";
import "../../favicon-194x194.png";

if (process.env.NODE_ENV == "production"){
  if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('../../service-worker.js');
  }
}

const $container = document.getElementById("container");

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
