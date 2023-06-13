import {init, close} from '../testServer/index.js';
import fs from 'fs';
import sinon from 'sinon';
import assert from 'assert';
import axios from 'axios';
import https from 'https';

export default () => {
    let cfg;
    let secureServerOpt;

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
            beforeEach(async () => {
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
                secureServerOpt =  {
                  key: fs.readFileSync('tests/testServer/testCerts/server.key'),
                  cert: fs.readFileSync('tests/testServer/testCerts/server.crt'),
                  requestCert: true,
                  rejectUnauthorized: false // don't care about valid chain
                };
            });
            
            it('Should authenticate correctly with http basic auth and openID', async () => {
                await init(cfg); //init server with default config
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
                await init(cfg); //init server with default config
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
                await init(cfg); //init server with default config
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
                await init(cfg); //init server with default config
                await axios.get('http://localhost:8080/api/v1/oasSecurity')
                .then(() => assert.fail("Expected code 401 but got 2XX"))
                .catch( err => {
                    assert.deepStrictEqual(err.response.data, {error: 'SecurityError: Missing token for security scheme basicAuth.'});
                    assert.equal(err.response.status, 401);
                });
            });

            it('Should fail with code 500 when using a non-declared security scheme', async () => {
                await init(cfg); //init server with default config
                await axios.get('http://localhost:8080/api/v1/oasSecurity/invalid')
                .then(() => assert.fail("Expected code 500 but got 2XX"))
                .catch( err => {
                    assert.deepStrictEqual(err.response.data, {error: "ConfigError: Security scheme 'undeclaredScheme' not found in OAS Document."});
                    assert.equal(err.response.status, 500);
                });
            });

            it('Should authenticate correctly with mutualTLS under openapi 3.1', async () => {
                cfg.middleware.security = {
                    disable: false,
                    auth: {
                        mutualTLSScheme: (cert) => {global.certCredentials = cert}
                    }
                };
                cfg.oasFile = 'tests/testServer/api/3.1.yaml';

                await init(cfg,secureServerOpt,true); // init https server
                await axios.get('https://localhost:8080/api/v1/oasSecurity', { 
                  httpsAgent: new https.Agent({
                    rejectUnauthorized: false, // don't care about valid chain
                    cert: fs.readFileSync('tests/testServer/testCerts/client.crt'),
                    key: fs.readFileSync('tests/testServer/testCerts/client.key'),
                  })
                })
                .then( res => {
                console.log(res.status);
                    assert("certCredentials" in global &&
                           "subject" in global.certCredentials &&
                           "CN" in global.certCredentials.subject,
                           "No client credentials");
                    assert.equal(global.certCredentials.subject.CN,'client.example.com');
                })
            });

            it('Should get empty client cert when server not requesting one, and mutualTLS under openapi 3.1', async () => {
                cfg.middleware.security = {
                    disable: false,
                    auth: {
                        mutualTLSScheme: (cert) => {global.certCredentials = cert}
                    }
                };
                cfg.oasFile = 'tests/testServer/api/3.1.yaml';
                secureServerOpt.requestCert =  false;
                secureServerOpt.rejectUnauthorized = true;

                await init(cfg,secureServerOpt,true); // init https server
                await axios.get('https://localhost:8080/api/v1/oasSecurity', {
                  httpsAgent: new https.Agent({
                    rejectUnauthorized: false // don't care about valid chain
                  })
                })
                .then( res => {
                    assert.equal(res.status, 200);
                    assert.equal(Object.keys(global.certCredentials).length, 0);
                })
            });
    
            afterEach((done) => {
                close().then(() => done());
            });        
        })
        
    })
}
