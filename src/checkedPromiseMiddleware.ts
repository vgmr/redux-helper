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

import { Action, Dispatch, MiddlewareAPI } from 'redux';
import { PromiseAction, IPromiseAction } from './actionCreators'

export interface CheckedPromiseMiddlewareOptions {
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    onError?: (error?: any) => Action;
    shouldExecute?: (state: any) => boolean;
}

const _validFunction = (obj: any): obj is Function => {
    return obj && typeof obj === 'function';
}

const _validAction = (object: any): object is Action => {
    return object && object instanceof Object &&
        !(object instanceof Array) &&
        typeof object !== "function" &&
        typeof object.type === "string";
}

const checkedPromiseMiddleware = (options?: CheckedPromiseMiddlewareOptions) => (midlapi: MiddlewareAPI<any>) => (next: Dispatch<any>) => (action: any) => {
    if (!action || !action.isPromiseAction || !action.payload) return next(action);
    let opts = options || {};
    const {
        checkExecution = false,
        enableProgress = true,
        message = 'loading',
        promiseParms,
        promise = undefined as Promise<any> | undefined,
        resultAction
    } = action.payload;

    if (!promise || typeof promise.then !== 'function' || !_validFunction(resultAction)) {
        return next(action);
    }

    const { dispatch, getState } = midlapi;

    if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState())) {
        console.log('discarding action ' + action.type);
        return;
    }

    if (enableProgress && _validFunction(opts.onStart)) {
        const actStart = opts.onStart(message);

        if (_validAction(actStart)) {
            Object.assign(actStart, <IPromiseAction>{
                promiseActionType: action.type,
                promiseActionEvent: 'OnStart',
                promiseActionMessage: message,
            });
            dispatch(actStart);
        }
    }

    return promise.then(
        response => {
            if (enableProgress && _validFunction(opts.onEnd)) {
                const actEnd = opts.onEnd();
                if (_validAction(actEnd)) {
                    Object.assign(actEnd, <IPromiseAction>{
                        promiseActionType: action.type,
                        promiseActionEvent: 'OnEnd'
                    });
                    dispatch(actEnd);
                }
            }

            const actResult = resultAction(response, promiseParms);
            dispatch(actResult);
        },
        error => {
            if (_validFunction(opts.onError)) {
                const actError = opts.onError(error);
                if (_validAction(actError)) {
                    Object.assign(actError, <IPromiseAction>{
                        promiseActionType: action.type,
                        promiseActionEvent: 'OnError',
                        promiseActionError: error
                    });
                    dispatch(actError);
                }
            }
        });
}

export default checkedPromiseMiddleware;
