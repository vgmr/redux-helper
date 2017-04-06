import * as mocha from 'mocha';
import * as  expect from 'expect';
import * as lib from '../src';

describe('Action Creators', () => {
    it('createAtion', () => {
        const simpleAction = lib.createAction<string>('TEST_ACTION');

        const actRes = simpleAction('test payload');

        expect(actRes.type).toEqual('TEST_ACTION');

        expect(actRes.payload).toEqual('test payload');

    })

    it('createAtion.matchAction', () => {
        const act1 = { type: 'TEST_ACTION', payload: 'test payload' };
        const act2 = { type: 'TEST_ANOTHER_ACTION', payload: 'test payload' };

        const simpleAction = lib.createAction<string>('TEST_ACTION');

        expect(simpleAction.matchAction(act1)).toEqual(true);
        expect(simpleAction.matchAction(act2)).toEqual(false);
    })

    it('createAction.typeCreated', () => {
        const simpleAction = lib.createAction<string>('TEST_ACTION');

        expect(simpleAction.typeCreated).toEqual('TEST_ACTION');
    })

    it('createPromiseAction.typeCreated', () => {
        const resultAction = lib.createAction<string>('RESULT_ACTION');
        const promiseAction = lib.createPromiseAction<string, string>(
            'TEST_PROMISE_ACTION',
            (value) => Promise.resolve('value'),
            resultAction);

        expect(promiseAction.typeCreated).toEqual('TEST_PROMISE_ACTION');
    })

});



