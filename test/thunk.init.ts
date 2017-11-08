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
import * as lib from "../src";
import { createPromiseWithThunkAction } from "../src";
import { Reducer, Action, createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

namespace thunkInit {

    export interface IAppState {
        result?: string;
        resultThunk?: string;
        resultThunk2?: string;
    }

    const initialState: IAppState = {};
    const resultAction = lib.createAction<string>("RESULT_ACTION");
    const resultThunkAction = lib.createAction<string>("RESULT_THUNK_ACTION");
    const resultThunkAction2 = lib.createAction<string>("RESULT_THUNK_ACTION2");

    export const action1 = createPromiseWithThunkAction(
        'PR',
        (s: string) => Promise.resolve(s),
        (d, g, r, p) => {
            d(resultThunkAction(p));
        }
    );

    export const action2 = createPromiseWithThunkAction(
        'PR2',
        (s: string) => Promise.resolve(s),
        resultAction,
        (d, g, r, p) => {
            d(resultThunkAction2(p));
        }
    );

    const reducer: Reducer<IAppState> = (
        state = initialState,
        action: lib.Action<any>
    ) => {
        if (resultAction.matchAction(action)) {
            return { ...state, result: action.payload };
        }
        if (resultThunkAction.matchAction(action)) {
            return { ...state, resultThunk: action.payload };
        }
        if (resultThunkAction2.matchAction(action)) {
            return { ...state, resultThunk2: action.payload };
        }
        return state;
    };

    export const getStore = () => {
        return createStore<IAppState>(
            reducer,
            applyMiddleware(...[lib.checkedPromiseMiddleware(), thunk])
        );
    };
}

export { thunkInit };