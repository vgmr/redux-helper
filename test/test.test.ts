// MIT License

// Copyright (c) 2016-17 (vgmr)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as mocha from 'mocha';
import * as  expect from 'expect';
import * as lib from '../src';
import { Action } from 'redux';
import { PromiseAction } from '../src/actionCreators';

describe('Action Creators', () => {

    it('createAction', () => {
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

    it('createAction.type', () => {
        const simpleAction = lib.createAction<string>('TEST_ACTION');
        expect(simpleAction.type).toEqual('TEST_ACTION');
    })

    it('createPromiseAction.type', () => {
        const resultAction = lib.createAction<string>('RESULT_ACTION');
        const promiseAction = lib.createPromiseAction<string, string>(
            'TEST_PROMISE_ACTION',
            (value) => Promise.resolve('value'),
            resultAction);

        expect(promiseAction.type).toEqual('TEST_PROMISE_ACTION');
    })
});