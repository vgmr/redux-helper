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

import * as Redux from 'redux';

/**
 * Action Interface
 */
export interface Action<TPayload> extends Redux.Action {
    payload: TPayload
}

/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): Action<TPayload>;
    matchAction(action: Redux.Action): action is Action<TPayload>;
    matchAsLinkedPromiseAction(action: Redux.Action): action is PromiseAction<TPayload>;
    type: string;
}

export const createAction = <TPayload>(type: string): CreateAction<TPayload> => {
    let create: any = <TPayload>(payload?: TPayload) => ({ type, payload });

    create.matchAction = <TPayLoad>(action: Redux.Action): action is Action<TPayload> => {
        return action.type === type
    };

    create.matchAsLinkedPromiseAction = <TPayLoad>(action: Redux.Action): action is PromiseAction<TPayload> => {
        return action.type === type && (<PromiseAction>action).promiseActionType != null;
    };

    create.type = type;
    return <CreateAction<TPayload>>create;
}

/**
 * Promise Action Interface and Creator
 */
export interface CreatePromiseAction<TParams = undefined> {
    (params?: TParams): Redux.Action;
    matchAction(action: Redux.Action): action is PromiseAction<TParams>;
    matchOnStart(action: Redux.Action): action is PromiseAction<TParams>;
    matchOnEnd(action: Redux.Action): action is PromiseAction<TParams>;
    matchOnError(action: Redux.Action): action is PromiseAction<TParams>;
    type: string;
}

/**
 * Promise Action Options
 */
export interface CreatePromiseActionOptions {
    checkExecution?: boolean,
    enableProgress?: boolean,
    message?: string
}

export interface IPromiseAction<TParams = undefined> {
    promiseActionType: string;
    promiseActionEvent: 'OnStart' | 'OnEnd' | 'OnError';
    promiseActionMessage?: string,
    promiseActionError?: any;
    promiseActionParams: TParams;
}

export interface PromiseAction<TParams = undefined> extends IPromiseAction<TParams>, Redux.Action { }

export const createPromiseAction = <TParms, TResult>(
    type: string,
    promise: (parms: TParms | undefined) => Promise<TResult>,
    resultAction: (res: TResult, parms?: TParms) => any,
    options?: CreatePromiseActionOptions): CreatePromiseAction<TParms> => {

    let create: any = (parms?: TParms) => (
        {
            type: type,
            isPromiseAction: true,
            payload: Object.assign({}, options, {
                promiseParms: parms,
                promise: promise(parms),
                resultAction: resultAction
            })
        }
    )

    create.matchAction = <TPayLoad>(action: Redux.Action): action is PromiseAction<TParms> =>
        (<PromiseAction>action).promiseActionType === type;

    create.matchOnStart = <TPayLoad>(action: Redux.Action): action is PromiseAction<TParms> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnStart';

    create.matchOnEnd = <TPayLoad>(action: Redux.Action): action is PromiseAction<TParms> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnEnd';

    create.matchOnError = <TPayLoad>(action: Redux.Action): action is PromiseAction<TParms> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnError';

    create.type = type;
    return <CreatePromiseAction<TParms>>create;
}

export function createPromiseThunkAction<TParms, TResult>(
    type: string,
    promise: (arg: TParms) => Promise<TResult>,
    afterResultThunk: (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, parms?: TParms) => void) {
    return createPromiseWithThunkAction(type, promise, undefined, afterResultThunk);
}

export function createPromiseWithThunkAction<TParms, TResult>(
    type: string,
    promise: (arg: TParms) => Promise<TResult>,
    resultAction: ((res: TResult, parms?: TParms | undefined) => any) | undefined,
    afterResultThunk: (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, parms?: TParms) => void) {

    const thunkAction = (res: TResult, parms?: TParms) => (dispatch: Redux.Dispatch<any>, getState: () => any) => {
        if (resultAction) dispatch(resultAction(res));
        if (afterResultThunk) afterResultThunk(dispatch, getState, res, parms);
    }

    return createPromiseAction(type, promise, thunkAction);
}
