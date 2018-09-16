const path    = require("path");
const express = require("express");
const fs      = require("fs");
const moment  = require("moment");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static("dist"));
app.use(express.static(path.join(__dirname, "client")));

var index = (process.env.NODE_ENV == "production") ? ("/index.html") : ("/dev.html");

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
fs.readdir(path.join(__dirname, "client/images/pokemon_icons"), (err, files)=>{

  if (err){
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  files.forEach((file, index)=>{

    const splitFileName = file.split("_");

    const shiny = file.includes("shiny");

    let special = false;
    if ((splitFileName.length === 6 && shiny) || (splitFileName.length === 5 && !shiny)){
      special = true;
    }

    const regular = (!special && !shiny);

    let gen;
    if (splitFileName[2] <= 151){
      gen = 1;
    } else if (splitFileName[2] <= 251){
      gen = 2;
    } else if (splitFileName[2] <= 386){
      gen = 3;
    }

    json.push({
      image: file,
      id: index,
      number: splitFileName[2],
      special,
      regular,
      gen,
      // gender
      shiny
    });

  });

});

app.get("/pokemon", (request, response)=>{
  response.json(JSON.stringify(json));
});

// app.get("*", (request, response)=>{
//   response.sendFile(__dirname + index)
// });

const currentDateTime = moment().format("MMMM Do YYYY, h:mm:ss a");

app.listen(PORT, ()=>{
  console.log("Server online at localhost:" + PORT + ", Sir. Date and time is " + currentDateTime);
});
