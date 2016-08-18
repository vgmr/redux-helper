import * as Redux from 'redux';

export interface Action<TPayload> extends Redux.Action {
    payload: TPayload
}

/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): ({ type: string, payload: TPayload });
    matchAction?(action: Redux.Action): action is Action<TPayload>;
}

export const createAction = <TPayload>(actionName: string): CreateAction<TPayload> => {
    let create: CreateAction<TPayload> = <TPayload>(payload?: TPayload) => ({ type: actionName, payload: payload });
    create.matchAction = <TPayLoad>(action: Redux.Action): action is Action<TPayload> => action.type === actionName;
    return create;
}

/**
 * Checked Action Interface and Creator
 */
export interface CheckedActionOptions {
    checkStatus?: boolean,
    loadingMessage?: string,
}

export const createCheckedAction = <TParms, TResult>(
    actionName: string,
    promise: (parms: TParms) => Promise<TResult>,
    resultAction: (res: TResult) => void,
    opts?: CheckedActionOptions) => (parms?: TParms) =>
        (
            {
                type: actionName,
                payload: Object.assign({}, opts, {
                    promise: promise(parms),
                    resultAction: resultAction
                })
            }
        );

export interface checkedPromiseMiddlewareOptions {
    setStatusMessageAction?: (loadingMessage?:string) => Redux.Action;
    trhowErrorAction?: (errorMessage:string) => Redux.Action;
}


export const checkedPromiseMiddleware = (opts:checkedPromiseMiddlewareOptions) => (middleware:Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => (action: any) => {
    if (!action || !action.payload) return next(action);
    const {
        checkStatus = false,
        loadingMessage,
        promise,
        resultAction
    } = action.payload;

    if (!promise || (typeof promise.then !== 'function' || !resultAction)) {
        return next(action);
    }
/*
    if (checkStatus && getStatus(getState()) != null) {
        console.log('check status prevent dispatch!');
        return;
    };
*/

    if (loadingMessage && opts.setStatusMessageAction) {
        middleware.dispatch(opts.setStatusMessageAction(loadingMessage));
    }

    promise
        .then(res => resultAction && middleware.dispatch(resultAction(res)))
        .then(() => loadingMessage && opts.setStatusMessageAction && middleware.dispatch(opts.setStatusMessageAction()))
        .catch(err => opts.trhowErrorAction && middleware.dispatch(opts.trhowErrorAction(err)));
}

export default checkedPromiseMiddleware;