import React    from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import * as serviceWorker from './serviceWorker';

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage";

import HomePage from "./js/HomePage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0hGN3-svJA_aBhXJdSHPH-xqvlwo78Zw",
  authDomain: "pogo-collector-e42c9.firebaseapp.com",
  databaseURL: "https://pogo-collector-e42c9.firebaseio.com",
  projectId: "pogo-collector-e42c9",
  storageBucket: "pogo-collector-e42c9.appspot.com",
  messagingSenderId: "889602272217",
  appId: "1:889602272217:web:acfa36394c1b30758447c8",
  measurementId: "G-78FBTN15HB"
};

firebase.initializeApp(firebaseConfig);
window.storage = firebase.storage().ref();

const $container = document.getElementById("root");

ReactDOM.render(
  (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={HomePage}/>

          <Route path="*" component={HomePage}/>
        </Switch>
      </div>
    </Router>
  ),
  $container
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
