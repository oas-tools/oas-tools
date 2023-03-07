import {init, close} from '../testServer/index.js';
import fs from 'fs';
import assert from 'assert';
import axios from 'axios';

export default () => {
    let cfg;

    describe('\n    OAS-ResponseValidator Middleware tests', () => {
        describe('Function tests', () => {
            before(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off'; // Set to 'error' if any test fail to see the error message
                cfg.middleware.validator = { strict : true };
                await init(cfg); //init server with default config
            });
            
            it('Should validate responses correctly', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator').then(res => {
                    assert.equal(res.status, 200);
                });
            });

            it('Should warn when some response has no content', async () => {
                await axios.delete('http://localhost:8080/api/v1/oasResponseValidator').then(res => {
                    assert.equal(res.status, 204);
                });
            });

            it('Should throw an error when response code is not expected (strict mode)', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator/unexpectedResponse')
                .then (() => assert.fail('Request succeeded when expected to fail'))
                .catch(err => {
                    assert.match(err.response.data.error, /ResponseValidationError: Response [\d]{3} is not defined in the OAS Document/);
                });
            });

            it('Should throw an error when content type is not accepted (strict mode)', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator', {headers: {'Accept' : ['application/xml']}})
                .then (() => assert.fail('Request succeeded when expected to fail'))
                .catch(err => {
                    assert.match(err.response.data.error, /ResponseValidationError: Response content-type is not accepted by the client/);
                    assert.equal(err.response.status, 500);
                });
            });

            it('Should throw an error when response is invalid (strict mode)', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator/wrongData')
                .then (() => assert.fail('Request succeeded when expected to fail'))
                .catch(err => {
                    assert.match(err.response.data.error, /ResponseValidationError: Wrong data in response/);
                });
            });

            it('Should parse the body before validating it according to the schema', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator/body/defaultFields')
                .then ((res) => {
                    const expected = {
                        message: 'Default value',
                        fixedProp: 1
                    }
                    assert.deepStrictEqual(res.data, expected);
                });
            });

            it('Should ignore required props marked as write only on response', async () => {
                await axios.get('http://localhost:8080/api/v1/oasResponseValidator/body/writeOnlyProp')
                .then ((res) => {
                    const expected = {readOnlyProp: "write only property is not required for response"}
                    assert.deepStrictEqual(res.data, expected);
                });
            });

            after((done) => {
                close().then(() => done());
            });         
        })
        
    })
}