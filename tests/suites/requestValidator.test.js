import {init, close} from '../testServer/index.js';
import fs from 'fs';
import assert from 'assert';
import axios from 'axios';

export default () => {
    let cfg;

    describe('\n    OAS-RequestValidator Middleware tests', () => {
        describe('Function tests', () => {
            before(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off'; // Set to 'error' if any test fail to see the error message
                cfg.middleware.validator = { strict : true };
                await init(cfg); //init server with default config
            });
            
            it('Should validate body and params correctly', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator?queryparamform=true', {test: 'A string body'}).then(res => {
                    assert.equal(res.status, 200);
                });
            });

            it('Should ignore readOnly required props on requests', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator/body/readOnlyProp', {
                    writeOnlyProp: 'read only props are ignored'
                }).then(res => {
                    assert.equal(res.status, 200);
                }).catch(e => console.log(e.response.data));
            });

            it('Should fail when body is not valid (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator?queryparamform=false', {test: 11223})
                .then( () => assert.fail('Got response code 200, expected 400'))
                .catch(err => {
                    assert.match(err.response.data?.error, /.*Validation failed at #\/properties\/test\/type > must be string.*/);
                    assert.equal(err.response.status, 400);
                });
            });
            
            it('Should fail when body is not provided (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator?queryparamform=false').then(() => {
                    assert.fail('Got response code 200 but expected 400');
                }).catch(err => {
                    assert.match(err.response?.data?.error, /.*Missing object in the request body\. Request body is required\..*/);
                    assert.equal(err.response.status, 400);
                })
            });

            it('Should fail when param is not valid (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator?queryparamform=notBoolean', {test: 'Valid body'}).then(() => {
                    assert.fail('Got response code 200 but expected 400');
                }).catch(err => {
                    assert.match(err.response?.data?.error, /.*Validation failed at #\/type > must be boolean.*/);
                    assert.equal(err.response.status, 400);
                })
            });

            it('Should fail when extraneous params provided in request query (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator?queryparamform=notBoolean&extraneousParam=one&extraneousParam2=two', {test: 'Valid body'}).then(() => {
                    assert.fail('Got response code 200 but expected 400');
                }).catch(err => {
                    assert.match(err.response?.data?.error, /Extraneous parameter found in request query:\n  - Missing declaration for "extraneousParam"\n  - Missing declaration for "extraneousParam2"/);
                    assert.equal(err.response.status, 400);
                })
            });

            it('Should fail when param is not provided (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator', {test: 'Valid body'}).then(() => {
                    assert.fail('Got response code 200 but expected 400');
                }).catch(err => {
                    assert.match(err.response?.data?.error, /.*Missing parameter (\w+) in the request (\w+)\. Parameter is required\..*/);
                    assert.equal(err.response.status, 400);
                })
            });

            it('Should fail when body is not declared in OAS Doc (strict mode)', async () => {
                await axios.post('http://localhost:8080/api/v1/oasRequestValidator/missingBody', {test: 'Some text'}).then(() => {
                    assert.fail('Got response code 200 but expected 400');
                }).catch(err => {
                    assert.match(err.response?.data?.error, /.*Missing request body declaration in OAS Document*/);
                    assert.equal(err.response.status, 400);
                })
            });

            after((done) => {
                close().then(() => done());
            });          
        })
        
    })
}