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
import { CreateAction, Action, CreatePromiseAction, CreatePromiseActionOptions, PromiseAction, LinkedPromiseAction, PromiseActionInstance } from './index';

// #region Action
export const createAction = <TPayload = undefined>(type: string): CreateAction<TPayload> => {
    let create: any = <TPayload>(payload?: TPayload) => payload && { type, payload } || { type };

    create.matchAction = <TPayLoad>(action: Redux.Action): action is Action<TPayload> => {
        return action.type === type
    };

    create.matchAsLinkedPromiseAction = <TParams>(action: Redux.Action, promiseAction?: CreatePromiseAction<TParams>): action is LinkedPromiseAction<TPayload, TParams> => {
        const typeMatch =  action.type === type;
        if ( promiseAction )
            return typeMatch && (<PromiseAction>action).promiseActionType === promiseAction.type;
        return typeMatch && (<PromiseAction>action).promiseActionType !== undefined;
    };

    create.type = type;
    return <CreateAction<TPayload>>create;
}

// #endregion

// #region Promise Action
export const createPromiseAction = <TParams, TResult>(
    type: string,
    promise: (params: TParams | undefined) => Promise<TResult>,
    resultAction: (res: TResult, params?: TParams) => any,
    options?: CreatePromiseActionOptions): CreatePromiseAction<TParams> => {

    let create: any = (params?: TParams) => (
        {
            type: type,
            isPromiseAction: true,
            payload: Object.assign({}, options, {
                promiseParams: params,
                promise: promise(params),
                resultAction: resultAction
            })
        }
    )

    create.matchOnStart = <TPayLoad>(action: Redux.Action): action is PromiseActionInstance<TParams> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnStart';

    create.matchOnEnd = <TPayLoad>(action: Redux.Action): action is PromiseActionInstance<TParams> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnEnd';

    create.matchOnError = <TPayLoad>(action: Redux.Action): action is PromiseActionInstance<TParams> =>
        (<PromiseAction>action).promiseActionType === type &&
        (<PromiseAction>action).promiseActionEvent === 'OnError';

    create.type = type;
    return <CreatePromiseAction<TParams>>create;
}


export interface ActionThunk<TParams, TResult> {
    (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, params?: TParams): void;
}

export interface ActionCreator<TParams, TResult> {
    (res: TResult, params?: TParams): any;
}

export interface ActionPromise<TParams, TResult> {
    (arg: TParams): Promise<TResult>;
}

export function createPromiseWithThunkAction<TParams, TResult>(type: string, promise: ActionPromise<TParams, TResult>, resultActionCreator: ActionCreator<TParams, TResult>, afterResultThunk: ActionThunk<TParams, TResult>, options: CreatePromiseActionOptions): CreatePromiseAction<TParams>;
export function createPromiseWithThunkAction<TParams, TResult>(type: string, promise: ActionPromise<TParams, TResult>, resultActionCreator: ActionCreator<TParams, TResult>, afterResultThunk: ActionThunk<TParams, TResult>): CreatePromiseAction<TParams>;
export function createPromiseWithThunkAction<TParams, TResult>(type: string, promise: ActionPromise<TParams, TResult>, thunk: ActionThunk<TParams, TResult>, options: CreatePromiseActionOptions): CreatePromiseAction<TParams>;
export function createPromiseWithThunkAction<TParams, TResult>(type: string, promise: ActionPromise<TParams, TResult>, thunk: ActionThunk<TParams, TResult>): CreatePromiseAction<TParams>;


export function createPromiseWithThunkAction<TParams, TResult>(type: string, promise: ActionPromise<TParams, TResult>, arg3?: any, arg4?: any, arg5?: any) {
    let options: CreatePromiseActionOptions | undefined = undefined;
    let resultActionCreator: ActionCreator<TParams, TResult> | undefined = undefined;
    let thunk: ActionThunk<TParams, TResult> | undefined = undefined;

    if (arg5 !== undefined) {
        options = arg5;
        thunk = arg4;
        resultActionCreator = arg3;
    } else if (typeof (arg4) !== "function") {
        options = arg4;
        thunk = arg3;
    } else if (typeof (arg4) === "function") {
        thunk = arg4;
        resultActionCreator = arg3;
    } else if (arg4 == undefined) {
        thunk = arg3;
    }

    const thunkAction = (res: TResult, params?: TParams) => (dispatch: Redux.Dispatch<any>, getState: () => any) => {
        if (resultActionCreator !== undefined) dispatch(resultActionCreator(res, params));
        if (thunk !== undefined) thunk(dispatch, getState, res, params);
    }

    return createPromiseAction(type, promise, thunkAction, options);
}

// #endregion