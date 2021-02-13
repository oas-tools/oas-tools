import bodyParser from "body-parser";
import * as fs from "fs";
import * as http from "http";
import * as jsyaml from "js-yaml";
import * as logger from "./logger/index.mjs";
import * as oasTools from "../../src/index.js";
import * as path from "path";
import express from "express";
import multer from "multer";

var app = express();
// multer is the official express middleware
// handling multipart/formdata requests
const upload = multer();
app.use(
  bodyParser.json({
    strict: false,
  })
);
app.use(upload.any()); // allow unlimited number of files with a request

var serverPort = 8080;

var spec = fs.readFileSync(path.join(__dirname, "api/oai-spec.yaml"), "utf8"); //this one works
var oasDoc = jsyaml.safeLoad(spec);

var securityThird = require(path.join(__dirname, "security.json"));
var grantsThird = require(path.join(__dirname, "grants.json"));

function verifyToken(req, secDef, token, next) {
  if (token) {
    next();
  } else {
    next(req.res.sendStatus(403));
  }
}

var options_object = {
  controllers: path.join(__dirname, "./controllers"),
  //loglevel: 'debug',
  //loglevel: 'none',
  customLogger: logger,
  strict: true,
  router: true,
  validator: true,
  oasSecurity: true,
  securityFile: {
    SecondBearer: "./tests/testServer/security.json",
    ThirdBearer: securityThird,
    FourthBearer: verifyToken,
  },
  oasAuth: true,
  grantsFile: {
    SecondBearer: "./tests/testServer/grants.json",
    ThirdBearer: grantsThird,
  },
  ignoreUnknownFormats: true,
};

function init(done) {
  oasTools.configure(options_object);

  oasTools.initialize(oasDoc, app, () => {
    // oas-tools version
    http.createServer(app).listen(serverPort, () => {
      // console.log("App running at http://localhost:" + serverPort);
      done();
    });
  });

  app.get("/info", (req, res) => {
    res.send({
      infoEN: "This is a very simple API that uses the oas-tools Module!",
      infoDE:
        "Dies ist eine sehr einfache API, die unser oas-tools Modul benutzt!",
    });
  });
}
app.init = init;
app.getServer = function getServer() {
  return app;
};
app.close = function close() {
  process.exit(0);
};

export default { app };
