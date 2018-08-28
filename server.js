const path    = require("path");
const express = require("express");
const fs      = require("fs");
const moment  = require("moment");

const PORT = process.env.PORT || 8080;

const app = express();

// app.use("/dist", express.static("dist"));
// app.use("/static", express.static("static"));
app.use(express.static(path.join(__dirname, "client")));
// var index = (process.env.NODE_ENV == "production") ? ("/index.html") : ("/staging.html");
var index = "/index.html";

if (process.env.NODE_ENV !== "production"){

  // index = "/dev.html";

  (function(){

    const webpack = require("webpack");
    const webpackConfig = require((process.env.WEBPACK_CONFIG) ? (process.env.WEBPACK_CONFIG) : ("./webpack.config.babel.js"));
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");

    app.use(webpackDevMiddleware(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpackHotMiddleware(compiler, {
      log: console.log, path: "/__webpack_hmr", heartbeat: 10 * 1000
    }));

  })();

}

let json = [];
fs.readdir(path.join(__dirname, "client/images/live_pokemon_icons"), (err, files)=>{

  if (err){
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach((file, index)=>{
    json.push({
      image: file
    });
  });

});

app.get("/thing", (request, response)=>{
  response.json(JSON.stringify(json));
});

app.get("*", (request, response)=>{
  response.sendFile(__dirname + index)
});

const currentDateTime = moment().format("MMMM Do YYYY, h:mm:ss a");

app.listen(PORT, ()=>{
  console.log("Server online at localhost:" + PORT + ", Sir. Date and time is " + currentDateTime);
});
