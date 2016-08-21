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
export interface CreateCheckedAction<TParms> {
    (parms?: TParms) : Redux.Action;
}

export interface CheckedActionOptions {
    checkStatus?: boolean,
    loadingMessage?: string,
}

export const createCheckedAction = <TParms, TResult>(
    actionName: string,
    promise: (parms: TParms) => Promise<TResult>,
    resultAction: (res: TResult) => void,
    opts?: CheckedActionOptions): CreateCheckedAction<TParms> => (parms?: TParms) =>
        (
            {
                type: actionName,
                payload: Object.assign({}, opts, {
                    promise: promise(parms),
                    resultAction: resultAction
                })
            }
        );

