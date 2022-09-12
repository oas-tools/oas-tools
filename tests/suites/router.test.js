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

            afterEach(() => {
                close();
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
        });
    });
}