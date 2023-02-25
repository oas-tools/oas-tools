import {init, close} from '../testServer/index.js';
import fs from 'fs';
import sinon from 'sinon';
import assert from 'assert';
import axios from 'axios';

export default () => {
    let cfg;

    describe('\n    OAS-ErrorHandler Middleware tests', () => {
        describe('Initialization tests', () => {
            beforeEach(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off'; // Set to 'error' if any test fail to see the error message
            });

            afterEach((done) => {
                close().then(() => done());
            });

            it('Should initialize correctly', async () => {
                await init(cfg);
                await axios.get('http://localhost:8080/status').then(res=> {
                    assert.equal(res.status, 200);
                });
            });
            
            it('Should fail with ConfigError when given a custom handler that is not a fnuction', async () => {
                sinon.stub(process, 'exit');
                cfg.middleware.error.customHandler = 'not a function';
                
                await init(cfg);
                assert(process.exit.calledWith(1));
                process.exit.restore();
            });

            it('Should fail with ConfigError when given handler takes an invalid number of arguments', async () => {
                sinon.stub(process, 'exit');
                cfg.middleware.error.customHandler = (arg1, arg2, arg3) => {};
                
                await init(cfg);
                assert(process.exit.calledWith(1));
                process.exit.restore();
            });
        });

        describe('Function tests', () => {
            before(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off';
                cfg.middleware.error.customHandler = (err, send) => {
                    if (err.name === "ResponseValidationError") {
                        send(500, {error: 'handled by custom handler'});
                    }
                };
                await init(cfg);
            });

            it('Should respond with code 400 when a bad request is received', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/badRequest')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 400);
                });
            });

            it('Should respond with code 401 when a security error occurs', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/security')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 401);
                });
            });

            it('Should respond with code 403 when an auth error occurs', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/auth')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 403);
                });
            });

            it('Should respond with code 406 when a content is not accepted', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/notAccepted')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 406);
                });
            });

            it('Should use the custom handler to handle a response validation error', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/responseValidation')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 500);
                    assert.deepStrictEqual(err.response.data, {error: "handled by custom handler"});
                });
            });

            it('Should respond with code 500 when unexpected error occurs', async () => {
                await axios.get('http://localhost:8080/api/v1/oasErrorHandler/unexpected')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 500);
                });
            });
    
            after((done) => {
                close().then(() => done());
            });          
        })
        
    })
}