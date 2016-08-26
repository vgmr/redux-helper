import * as Redux from 'redux';

export interface Action<TPayload> extends Redux.Action {
    payload: TPayload
}

/**
 * Plain Action creator
 */
export interface CreateAction<TPayload> {
    (payload?: TPayload): Action<TPayload>;
    matchAction?(action: Redux.Action): action is Action<TPayload>;
}

export const createAction = <TPayload>(actionName: string): CreateAction<TPayload> => {
    let create: CreateAction<TPayload> = <TPayload>(payload?: TPayload) => ({ type: actionName, payload: payload });
    create.matchAction = <TPayLoad>(action: Redux.Action): action is Action<TPayload> => action.type === actionName;
    return create;
}

/**
 * Promise Action Interface and Creator
 */
export interface CreatePromiseAction<TParms> {
    (parms?: TParms): Redux.Action;
    matchAction?(action: PromiseAction): action is Redux.Action;
    matchOnStart?(action: PromiseAction): action is Redux.Action;
    matchOnEnd?(action: PromiseAction): action is Redux.Action;
    matchOnError?(action: PromiseAction): action is Redux.Action;
}

/**
 * Promise Action Options
 */
export interface CreatePromiseActionOptions {
    checkExecution?: boolean,
    enableProgress?: boolean,
    message?: string
}

export interface PromiseAction extends Redux.Action {
    promiseActionType?: string;
    promiseActionEvent?: 'OnStart' | 'OnEnd' | 'OnError';
    promiseActionMessage?: string,
    promiseActionError?: any;
}

export const createPromiseAction = <TParms, TResult>(
    actionName: string,
    promise: (parms: TParms) => Promise<TResult>,
    resultAction: (res: TResult) => Redux.Action,
    options?: CreatePromiseActionOptions): CreatePromiseAction<TParms> => {

    let create: CreatePromiseAction<TParms> = (parms?: TParms) => (
        {
            type: actionName,
            payload: Object.assign({}, options, {
                promise: promise(parms),
                resultAction: resultAction
            })
        }
    )

    create.matchAction = <TPayLoad>(action: PromiseAction): action is PromiseAction => action.promiseActionType === actionName;
    create.matchOnStart = <TPayLoad>(action: PromiseAction): action is PromiseAction => action.promiseActionType === actionName && action.promiseActionEvent === 'OnStart';
    create.matchOnEnd = <TPayLoad>(action: PromiseAction): action is PromiseAction => action.promiseActionType === actionName && action.promiseActionEvent === 'OnEnd';
    create.matchOnError = <TPayLoad>(action: PromiseAction): action is PromiseAction => action.promiseActionType === actionName && action.promiseActionEvent === 'OnError';
    return create;
}

