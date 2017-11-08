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

export const createAction = <TPayload>(type: string): CreateAction<TPayload> => {
    let create: any = <TPayload>(payload?: TPayload) => ({ type: type, payload: payload });

    create.matchAction = <TPayLoad>(action: Redux.Action): action is Action<TPayload> => {
        return action.type === type
    };

    create.matchAsLinkedPromiseAction = <TParams>(action: Redux.Action, promiseAction: CreatePromiseAction<TParams>): action is LinkedPromiseAction<TPayload, TParams> => {
        return action.type === type && (<PromiseAction>action).promiseActionType === promiseAction.type;
    };

    create.type = type;
    return <CreateAction<TPayload>>create;
}


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

export function createPromiseWithThunkAction<TParams, TResult>(
    type: string,
    promise: (arg: TParams) => Promise<TResult>,
    thunk: (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, params?: TParams) => void
): CreatePromiseAction<TParams>;

export function createPromiseWithThunkAction<TParams, TResult>(
    type: string,
    promise: (arg: TParams) => Promise<TResult>,
    resultActionBuilder: ((res: TResult, params?: TParams) => any),
    afterResultThunk: (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, params?: TParams) => void
): CreatePromiseAction<TParams>;

export function createPromiseWithThunkAction<TParams, TResult>(
    type: string,
    promise: (arg: TParams) => Promise<TResult>,
    resultActionBuilderOrThunk: any | undefined,
    afterResultThunk?: any) {

    const resultActionBuilder: (res: TResult, params?: TParams) => any = afterResultThunk ? resultActionBuilderOrThunk : undefined;
    const thunk: (dispatch: Redux.Dispatch<any>, getState: () => any, res: TResult, params?: TParams) => void = afterResultThunk ? afterResultThunk : resultActionBuilderOrThunk;

    const thunkAction = (res: TResult, params?: TParams) => (dispatch: Redux.Dispatch<any>, getState: () => any) => {
        if (resultActionBuilder !== undefined) dispatch(resultActionBuilder(res, params));
        if (thunk !== undefined) thunk(dispatch, getState, res, params);
    }

    return createPromiseAction(type, promise, thunkAction);
}