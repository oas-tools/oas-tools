/*!
project-template-nodejs 0.0.0, built on: 2017-03-30
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/project-template-nodejs

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


'use strict';

var lib = require('../../src');
var expect = require('chai').expect;

describe('Second Level test', function () {
    it('Execute', (done) => {

        lib.myPromiseFunction("test", "2").then(function (result) {
            expect(result).to.be.equal("test-2");
            done();
        }, function (error) {
            done(error);
        });

    });
});