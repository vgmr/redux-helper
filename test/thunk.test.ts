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
import * as mocha from "mocha";
import * as expect from "expect";
import { thunkInit } from './thunk.init';
import { Store } from "redux";

describe("thunked actions", () => {

    let store: Store<thunkInit.IAppState>;

    describe("thunked actions result", () => {

        before(() => {
            store = thunkInit.getStore();
            store.dispatch(thunkInit.action1('test'));
            store.dispatch(thunkInit.action2('test 2'));
        });

        it('should match result', () => {
            const state = store.getState();
            expect(state.result).toEqual('test 2')
            expect(state.resultThunk).toEqual('test')
            expect(state.resultThunk2).toEqual('test 2')
        })

    });

});