import React    from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import Nav                  from "./nav.js";
import HomePage             from "./HomePage.js";

// import * as OfflinePluginRuntime from 'offline-plugin/runtime';
// OfflinePluginRuntime.install({
//   onInstalled: function onInstalled() {
//     console.log('OfflinePluginRuntime.onInstalled');
//   },
//   onUpdateReady: function onUpdateReady() {
//     console.log('OfflinePluginRuntime.onUpdateReady');
//   },
//   onUpdating: function onUpdating() {
//     console.log('OfflinePluginRuntime.onUpdating');
//   },
//   onUpdated: function onUpdated() {
//     console.log('OfflinePluginRuntime.onUpdated');
//   },
//   // onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
//   // onUpdated: () => window.swUpdate = true,
// });
//  window.addEventListener('offline', () => {
//   console.log('Went offline!');
// });

// import runtime from 'serviceworker-webpack-plugin/lib/runtime';
//
// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
// }

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('../../dist/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('../../service-worker.js');
}

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
