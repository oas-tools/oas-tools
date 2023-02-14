import {init, close} from '../testServer/index.js';
import fs from 'fs';
import sinon from 'sinon';
import assert from 'assert';
import axios from 'axios';

export default () => {
    let cfg;

    describe('\n    OAS-Security Middleware tests', () => {
        describe('Initialization tests', () => {
            beforeEach(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off'; // Set to 'error' if any test fail to see the error message
                cfg.middleware.security = {
                    disable: false,
                    auth: {
                        basicAuth: (credentials) => {global.basicAuthCredentials = credentials},
                        bearerAuth: (credentials) => {global.bearerAuthCredentials = credentials},
                        apiKeyQuery: (credentials) => {global.apiKeyQuerCredentials = credentials},
                        apiKeyHeader: (credentials) => {global.apiKeyHeaderCredentials = credentials},
                        apiKeyCookie: (credentials) => {global.apiKeyCookieCredentials = credentials},
                        openID: (secDef, secScope) => {global.openIDCredentials = {secDef, secScope}}
                    }
                }
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
            
            it('Should fail with ConfigError when no handlers defined in config', async () => {
                sinon.stub(process, 'exit');
                cfg.middleware.security.auth = undefined;
                
                await init(cfg);
                assert(process.exit.calledWith(1));
                process.exit.restore();
            });

            it('Should fail with ConfigError when no handlers defined for any security scheme', async () => {
                sinon.stub(process, 'exit');
                cfg.middleware.security.auth.openID = undefined;
                
                await init(cfg);
                assert(process.exit.calledWith(1));
                process.exit.restore();
            });

            it('Should fail with ConfigError when any handler is not a function', async () => {
                sinon.stub(process, 'exit');
                cfg.middleware.security.auth.openID = 'not a function';
                
                await init(cfg);
                assert(process.exit.calledWith(1));
                process.exit.restore();
            });
        });

        describe('Function tests', () => {
            before(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
                cfg.logger.level = 'off'; // Set to 'error' if any test fail to see the error message
                cfg.middleware.security = {
                    disable: false,
                    auth: {
                        basicAuth: (credentials, _setStatus) => {global.basicAuthCredentials = credentials},
                        bearerAuth: (credentials, _setStatus) => {global.bearerAuthCredentials = credentials},
                        apiKeyQuery: (credentials, _setStatus) => {global.apiKeyQuerCredentials = credentials},
                        apiKeyHeader: (credentials, _setStatus) => {global.apiKeyHeaderCredentials = credentials},
                        apiKeyCookie: (credentials, _setStatus) => {global.apiKeyCookieCredentials = credentials},
                        openID: (secDef, secScope, _setStatus) => {global.openIDCredentials = {secDef, secScope}}
                    }
                }
                await init(cfg); //init server with default config
            });
            
            it('Should authenticate correctly with http basic auth and openID', async () => {
                await axios.get('http://localhost:8080/api/v1/oasSecurity', { 
                    headers: { 
                        Authorization: 'Basic ' + Buffer.from('test:test').toString('base64') 
                    } 
                }).then( res => {
                    assert.equal(res.status, 200);
                    assert.equal(Buffer.from(global.basicAuthCredentials.replace('Basic ', ''), 'base64').toString(), 'test:test');
                    assert.deepStrictEqual(global.openIDCredentials, {
                        secDef: { type: 'openIdConnect', openIdConnectUrl: 'https://test.com/openid/connect' },
                        secScope: [ 'read', 'write' ]
                    });
                });
            });
    
            it('Should authenticate correctly with http bearer auth', async () => {
                await axios.get('http://localhost:8080/api/v1/oasSecurity/bearer', { 
                    headers: { 
                        Authorization: 'Bearer ' + Buffer.from('test:test').toString('base64') 
                    } 
                }).then( res => {
                    assert.equal(res.status, 200);
                    assert.equal(Buffer.from(global.bearerAuthCredentials.replace('Bearer ', ''), 'base64').toString(), 'test:test');
                });
            });
    
            it('Should authenticate correctly with all apiKeys defined in OAS Doc', async () => {
                await axios.get('http://localhost:8080/api/v1/oasSecurity?apiKeyQuery=testApiKeyQuery', { 
                    headers: { 
                        apiKeyHeader: 'testApiKeyHeader',
                        Cookie: 'apiKeyCookie=testApiKeyCookie'
                    } 
                }).then( res => {
                    assert.equal(res.status, 200);
                    assert.equal(global.apiKeyQuerCredentials, 'testApiKeyQuery');
                    assert.equal(global.apiKeyHeaderCredentials, 'testApiKeyHeader');
                    assert.equal(global.apiKeyCookieCredentials, 'testApiKeyCookie');
                });
            });
    
            it('Should fail with code 401 when missing the required auth types', async () => {
                await axios.get('http://localhost:8080/api/v1/oasSecurity')
                .then(() => assert.fail("Expected code 401 but got 2XX"))
                .catch( err => {
                    assert.deepStrictEqual(err.response.data, {error: 'SecurityError: Missing token for security scheme basicAuth.'});
                    assert.equal(err.response.status, 401);
                });
            });

            it('Should fail with code 500 when using a non-declared security scheme', async () => {
                await axios.get('http://localhost:8080/api/v1/oasSecurity/invalid')
                .then(() => assert.fail("Expected code 500 but got 2XX"))
                .catch( err => {
                    assert.deepStrictEqual(err.response.data, {error: "ConfigError: Security scheme 'undeclaredScheme' not found in OAS Document."});
                    assert.equal(err.response.status, 500);
                });
            });
    
            after((done) => {
                close().then(() => done());
            });        
        })
        
    })
}