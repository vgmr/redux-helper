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
 * LinkedPromiseAction type ( linked action return interface )
 */
export type LinkedPromiseAction<TPayload, TParams> = Action<TPayload> & PromiseActionInstance<TParams>;

/**
 * Promise Action Interface
 */

export interface PromiseAction extends Redux.Action {
    promiseActionType: string;
    promiseActionEvent: 'OnStart' | 'OnEnd' | 'OnError';
    promiseActionMessage?: string,
    promiseActionError?: any;
}

/**
 * Promise Action instance (parameters)
 */
export interface PromiseActionInstance<TParams> extends PromiseAction {
    promiseActionParams: TParams;
}

/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): Action<TPayload>;
    matchAction(action: Redux.Action): action is Action<TPayload>;
    matchAsLinkedPromiseAction<TParams>(action: Redux.Action, promiseAction: CreatePromiseAction<TParams>): action is Action<TPayload> & PromiseActionInstance<TParams>;
    type: string;
}

/**
 * Promise Action Interface and Creator
 */
export interface CreatePromiseAction<TParams> {
    (params?: TParams): Redux.Action;
    matchOnStart(action: Redux.Action): action is PromiseActionInstance<TParams>;
    matchOnEnd(action: Redux.Action): action is PromiseActionInstance<TParams>;
    matchOnError(action: Redux.Action): action is PromiseActionInstance<TParams>;
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