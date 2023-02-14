import {init, close} from '../testServer/index.js';
import fs from 'fs';
import assert from 'assert';
import axios from 'axios';

export default () => {
    let cfg;

    describe('\n    OAS-Router Middleware tests', () => {
        describe('Function tests', () => {
            beforeEach(async () => {
                cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
            });

            afterEach((done) => {
                close().then(() => done());
            });   
            
            it('Should route to controller correctly with annotations disabled', async () => {
                cfg.useAnnotations = false;
                await init(cfg);
                
                await axios.get('http://localhost:8080/api/v1/oasRouter').then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.data, 'Test service for router middleware');
                });
            });

            it('Should route to controller correctly with annotations enabled', async () => {
                cfg.useAnnotations = true;
                await init(cfg);
                
                await axios.get('http://localhost:8080/api/v1/oasRouter').then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.data, 'Test service for router middleware');
                });
            });
            
            it('Should route to controller correctly when controller is async', async () => {
                cfg.useAnnotations = false;
                await init(cfg);
                
                await axios.get('http://localhost:8080/api/v1/oasRouter/async').then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.data, 'Test service for router middleware');
                });
            });
            
            it('Should route to controller correctly when controller is async and fail if an error is thrown', async () => {
                cfg.useAnnotations = false;
                cfg.logger.level = 'off';
                await init(cfg);
                
                await axios.get('http://localhost:8080/api/v1/oasRouter/asyncthrow')
                .then(() => assert.fail('Expected request to fail but got code 2XX'))
                .catch( err => {
                    assert.equal(err.response.status, 500);
                    assert.deepStrictEqual(err.response.data, {error: "Error: Error raised in async controller"});
                });
            });
        });
    });
}