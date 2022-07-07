import {init, close} from '../testServer/index.js';
import fs from 'fs';
import assert from 'assert';
import axios from 'axios';
import sinon from 'sinon';

export default () => {
    let cfg;

    describe('Initialization tests', () => {
        beforeEach(() => {
            // set cfg to .oastoolsrc file in testServer
            cfg = JSON.parse(fs.readFileSync('tests/testServer/.oastoolsrc'));
        });

        afterEach(() => {
            close();
        })
    
        it('Should initialize correctly with default config for OAS 3.0', async () => {
            await init();
            await axios.get('http://localhost:8080/status').then(res=> {
                assert.equal(res.status, 200);
            });
        });

        it('Should initialize correctly with default config for OAS 3.1', async () => {
            cfg.oasFile = 'tests/testServer/api/3.1.yaml';
            await init(cfg);
            await axios.get('http://localhost:8080/status').then(res=> {
                assert.equal(res.status, 200);
            });
        });

        it('Should fail initialization if schema version is not supported', async () => {
            sinon.stub(process, 'exit');
            cfg.oasFile = 'tests/testServer/api/invalidVersion.yaml';
            cfg.logger.level = 'off';
            
            await init(cfg);
            assert(process.exit.calledWith(1));
            process.exit.restore();
        });

        it('Should fail initialization if schema is not valid', async () => {
            sinon.stub(process, 'exit');
            cfg.oasFile = 'tests/testServer/api/invalid.yaml';
            cfg.logger.level = 'off';
            
            await init(cfg);
            assert(process.exit.calledWith(1));
            process.exit.restore();
        });

        it('Should fail initialization if the spec doc is not found', async () => {
            sinon.stub(process, 'exit');
            cfg.oasFile = 'some/not/existent/file.yaml';
            cfg.logger.level = 'off';
            
            await init(cfg);
            assert(process.exit.calledWith(1));
            process.exit.restore();
        });

        it('Should fail initialization when invalid external middleware provided', async () => {
            sinon.stub(process, 'exit');
            cfg.middleware.external = 'not an array';
            cfg.logger.level = 'off';
            
            await init(cfg);
            assert(process.exit.calledWith(1));
            process.exit.restore();
        });
    })
}