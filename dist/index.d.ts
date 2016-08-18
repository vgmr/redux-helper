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
export interface CheckedActionOptions {
    checkStatus?: boolean;
    loadingMessage?: string;
}
export declare const createCheckedAction: <TParms, TResult>(actionName: string, promise: (parms: TParms) => Promise<TResult>, resultAction: (res: TResult) => void, opts?: CheckedActionOptions) => (parms?: TParms) => {
    type: string;
    payload: {} & CheckedActionOptions & {
        promise: Promise<TResult>;
        resultAction: (res: TResult) => void;
    };
};
export interface checkedPromiseMiddlewareOptions {
    setStatusMessageAction?: (loadingMessage?: string) => Redux.Action;
    trhowErrorAction?: (errorMessage: string) => Redux.Action;
}
export declare const checkedPromiseMiddleware: (opts: checkedPromiseMiddlewareOptions) => (middleware: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => (action: any) => any;
export default checkedPromiseMiddleware;
