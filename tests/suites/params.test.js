import {init, close} from '../testServer/index.js';
import assert from 'assert';
import axios from 'axios';

export default () => {

    describe('\n    OAS-Params Middleware tests', () => {

        before(async () => {
            await init(); //init server with default config
        });

        it('Should parse path params correctly (explode false)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams/1/.3,4,5/;testparamsmatrix=key,value,otherkey,othervalue')
            .then(res => {
                let expected = {
                    params: {
                        testparamsimple: 1,
                        testparamslabel: ['3', '4', '5'],
                        testparamsmatrix: {key: 'value', otherkey: 'othervalue'}
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse path params correctly (explode true)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams/explode/1/.3.4.5/;key=value;otherkey=othervalue')
            .then(res => {
                let expected = {
                    params: {
                        testparamsimple: 1,
                        testparamslabel: ['3', '4', '5'],
                        testparamsmatrix: {key: 'value', otherkey: 'othervalue'}
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse query params correctly (explode false)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams?queryparamform=true&queryparamspacedelimited=1 2 3&queryparampipedelimited=1|2|3')
            .then(res => {
                let expected = {
                    params: {
                        queryparamform: true,
                        queryparamspacedelimited: ['1', '2', '3'],
                        queryparampipedelimited: ['1', '2', '3']
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse query params correctly (explode true)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams/explode?queryparamform=true&queryparamspacedelimited=1&queryparamspacedelimited=2&queryparampipedelimited=1&queryparamdeepobject[key]=value&queryparamdeepobject[otherkey]=othervalue')
            .then(res => {
                let expected = {
                    params: {
                        queryparamform: true,
                        queryparamspacedelimited: ['1', '2'],
                        queryparampipedelimited: ['1'],
                        queryparamdeepobject: {key: 'value', otherkey: 'othervalue'}
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse header params correctly (explode false)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams', { headers: { headerparam: '2022-06-19T00:00:00.000Z' } })
            .then(res => {
                let expected = {
                    params: {
                        headerparam: '2022-06-19T00:00:00.000Z'
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse header params correctly (explode true)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams/explode', { headers: { headerparam: "key=value,otherkey=othervalue" } })
            .then(res => {
                let expected = {
                    params: {
                        headerparam: {key: 'value', otherkey: 'othervalue'}
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse cookie params correctly (explode false)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams', { headers: { Cookie: "cookieparam=1" } })
            .then(res => {
                let expected = {
                    params: {
                        cookieparam: 1
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });

        it('Should parse cookie params correctly (explode true)', async () => {
            await axios.get('http://localhost:8080/api/v1/oasParams/explode', { headers: { Cookie: "cookieparam=1,2,3" } })
            .then(res => {
                let expected = {
                    params: {
                        cookieparam: ['1', '2', '3']
                    },
                    body: {}
                }
                assert.deepStrictEqual(res.data, expected);
            });
        });


        it('Should parse request body correctly taking defaults into account', async () => {
            await axios.post('http://localhost:8080/api/v1/oasParams/body/defaultFields', [{prop2: {prop31: [null, {}]}, prop3: null}] )
              .then(res => {
                  let expected = {
                      params: {},
                      body: [{ prop2: { prop31: [{ prop311:"hello" }, { prop311:"hello" }], prop21: false}, prop3: null, prop1: 1 }]
                  }
                  assert.deepStrictEqual(res.data, expected);
              });
        });

        it('Should parse request body correctly taking required into account', async () => {
            await axios.post('http://localhost:8080/api/v1/oasParams/body/requiredFields', {prop1: 1})
              .then(res => {
                  let expected = {
                      params: {},
                      body: { prop1: 1}
                  }
                  assert.deepStrictEqual(res.data, expected);
              });
        });

        after((done) => {
            close().then(() => done());
        });          
    })
}
