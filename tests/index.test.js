import initTest from './suites/init.test.js';
import paramTest from './suites/params.test.js';
import securityTest from './suites/security.test.js';
import requestValidatorTest from './suites/requestValidator.test.js';
import routerTest from './suites/router.test.js';
import responseValidatorTest from './suites/responseValidator.test.js';

describe('OAS TOOLS TESING SUITE', () => {
    after(() => {
        process.exit(0);
    });

    // Test suites
    initTest();
    paramTest();
    securityTest();
    requestValidatorTest();
    routerTest();
    responseValidatorTest();
});