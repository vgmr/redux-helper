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
import * as lib from "../src";
import { createStore, applyMiddleware, Reducer, Store, Action } from "redux";
import { createPromiseWithThunkAction, createAction, CheckedPromiseMiddlewareOptions } from "../src";
import { expectExist } from "./common";

namespace linkedInit {
    export const STARTING_MESSAGE = 'Start';
    export const ENDING_MESSAGE = 'End';

    export const onStart = lib.createAction<string>('ON_START');
    export const onEnd = lib.createAction<string>('ON_END');
    export const result = lib.createAction<string>('RESULT');
    export const promiseAction = lib.createPromiseAction('LINKED_PROMISE_ACTION', (val: string) => Promise.resolve(`${val} for test`), result);

    const MIDLWOPTS: CheckedPromiseMiddlewareOptions = {
        onEnd: (act) => onEnd(`${ENDING_MESSAGE}_${act!.type}`),
        onStart: (msg, act) => onStart(`${STARTING_MESSAGE}_${act!.type}`)
    }

    type ActModel = {
        type?: string;
        actionType?: string,
        actionParams?: any,
        actionEvent?: 'OnStart' | 'OnEnd' | 'OnError';
        payload?: any;
    }

    export interface IAppState {
        linkedStart?: ActModel;
        linkedEnd?: ActModel;
        promiseStart?: ActModel;
        promiseEnd?: ActModel;
        result?: string;
    }

    const initialState: IAppState = {};

    const reducer: Reducer<IAppState> = (state: IAppState = initialState, action: Action) => {
        let retState = undefined;

        if (onStart.matchAsLinkedPromiseAction(action, promiseAction)) {
            retState = {
                ...state,
                ...retState || {},
                linkedStart: {
                    type: action.type,
                    actionType: promiseAction.type,
                    actionParams: action.promiseActionParams,
                    payload: action.payload
                },
                result: action.payload
            }
        }

        if (onEnd.matchAsLinkedPromiseAction(action, promiseAction)) {
            retState = {
                ...state,
                ...retState || {},
                linkedEnd: {
                    type: action.type,
                    actionType: promiseAction.type,
                    actionParams: action.promiseActionParams,
                    payload: action.payload
                },
                result: action.payload
            }
        }

        if (promiseAction.matchOnStart(action)) {
            retState = {
                ...state,
                ...retState || {},
                promiseStart: {
                    type: action.type,
                    actionType: promiseAction.type,
                    actionParams: action.promiseActionParams,
                    actionEvent: action.promiseActionEvent
                }
            }
        }

        if (promiseAction.matchOnEnd(action)) {
            retState = {
                ...state,
                ...retState || {},
                promiseEnd: {
                    type: action.type,
                    actionType: promiseAction.type,
                    actionParams: action.promiseActionParams,
                    actionEvent: action.promiseActionEvent
                }
            }
        }

        if (result.matchAction(action)) {
            retState = {
                ...state,
                result: action.payload
            }
        }

        return retState || state;
    };

    export const getStore = () => {

        return createStore<IAppState>(
            reducer,
            applyMiddleware(lib.checkedPromiseMiddleware(MIDLWOPTS))
        );
    };
}

export { linkedInit };