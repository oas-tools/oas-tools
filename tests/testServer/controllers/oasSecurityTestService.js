'use strict'

export function getRequest(req, res, next) {
  res.send('Test service for security middleware');
};