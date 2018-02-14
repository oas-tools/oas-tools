/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Apigee Corporation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var _ = require('lodash-compat');

var initializeMiddleware = function initializeMiddleware(rlOrSO, callback) { // THERE ARE NO RESOURCES IN OAS v3, RIGHT?
  // rlOrSO: is the spec file, oasDoc from the index.js
  //resources: is the function that initializes middlewares one by one in the index.js file! but actually what happens is that this is not defined, while callback is
  //callback: is undefined, because it is being pased here as the second parameter, so as resources! this is only used for version 1.2

  if (_.isUndefined(rlOrSO)) {
    throw new Error('rlOrSO is required');
  } else if (!_.isPlainObject(rlOrSO)) {
    throw new TypeError('rlOrSO must be an object');
  }

  if (_.isUndefined(callback)) {
    throw new Error('callback is required');
  } else if (!_.isFunction(callback)) {
    throw new TypeError('callback must be a function');
  }

  callback({ //THIS IS WHERE THE DIFFERENT MIDDLEWARES ARE "STARTED" AND ARE CONFIGURED TO USE THE SPECIFIED PARAMETERS, RIGHT?
    // deleted all the stuff about other middlewares (metadata and security) as so far we just have VALIDATOR and ROUTER
    OASRouter: require('./middleware/oas-router'),
    OASValidator: require('./middleware/oas-validator')
  });
};

module.exports = {
  initializeMiddleware: initializeMiddleware
};
