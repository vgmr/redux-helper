import * as Redux from 'redux';
export interface Action<TPayload> extends Redux.Action {
    payload: TPayload;
}
/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): ({
        type: string;
        payload: TPayload;
    });
    matchAction?(action: Redux.Action): action is Action<TPayload>;
}
export declare const createAction: <TPayload>(actionName: string) => CreateAction<TPayload>;
/**
 * Checked Action Interface and Creator
 */
export interface CreateCheckedAction<TParms> {
    (parms?: TParms): void;
}
export interface CheckedActionOptions {
    checkStatus?: boolean;
    loadingMessage?: string;
}
export declare const createCheckedAction: <TParms, TResult>(actionName: string, promise: (parms: TParms) => Promise<TResult>, resultAction: (res: TResult) => void, opts?: CheckedActionOptions) => CreateCheckedAction<TParms>;
