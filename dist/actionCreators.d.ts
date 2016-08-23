import * as Redux from 'redux';
export interface Action<TPayload> extends Redux.Action {
    payload: TPayload;
}
/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): Action<TPayload>;
    matchAction?(action: Redux.Action): action is Action<TPayload>;
}
export declare const createAction: <TPayload>(actionName: string) => CreateAction<TPayload>;
/**
 * Promise Action Interface and Creator
 */
export interface CreatePromiseAction<TParms> {
    (parms?: TParms): Redux.Action;
}
/**
 * Promise Action Options
 */
export interface CreatePromiseActionOptions {
    checkExecution?: boolean;
    enableProgress?: boolean;
    message?: string;
}
export declare const createPromiseAction: <TParms, TResult>(actionName: string, promise: (parms: TParms) => Promise<TResult>, resultAction: (res: TResult) => Redux.Action, options?: CreatePromiseActionOptions) => CreatePromiseAction<TParms>;
