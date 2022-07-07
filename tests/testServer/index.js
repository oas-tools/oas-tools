'use strict';

import express from 'express';
import http from 'http';
import fs from 'fs';
import {initialize} from '../../src/index.js';

var server;
var app = express();

// Only for testing
var defaults = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'))

export async function init(config) {
  app.use(express.json({limit: '50mb'}));
  app.get('/status', (_req, res, _next) => res.status(200).send('Up'));
  await initialize(app, config ?? defaults).then(() => {
    server = http.createServer(app)
    server.listen(8080);
  });
}

export function close() {
  app = express();
  server.close();
  process.removeAllListeners(); // prevents memory leak
}