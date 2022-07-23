import initTest from './suites/init.test.js';
import paramTest from './suites/params.test.js';
import securityTest from './suites/security.test.js';
import requestValidatorTest from './suites/requestValidator.test.js';
import routerTest from './suites/router.test.js';
import responseValidatorTest from './suites/responseValidator.test.js';
import errorHandlerTest from './suites/errorHandler.test.js';

describe('OAS TOOLS TESING SUITE', () => {
    const nodeMajor = parseInt(process.version.split('.')[0].replace('v',''));
    
    after(() => {
        process.exit(0);
    });
    
    // Test suites
    initTest();
    paramTest();
    if(nodeMajor >= 16) securityTest();
    requestValidatorTest();
    routerTest();
    responseValidatorTest();
    errorHandlerTest();
});