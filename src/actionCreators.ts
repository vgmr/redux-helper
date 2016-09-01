import * as Redux from 'redux';

/**
 * Action Interface
 */
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
    matchAction?(action: Redux.Action): action is PromiseAction;
    matchOnStart?(action: Redux.Action): action is PromiseAction;
    matchOnEnd?(action: Redux.Action): action is PromiseAction;
    matchOnError?(action: Redux.Action): action is PromiseAction;
}

/**
 * Promise Action Options
 */
export interface CreatePromiseActionOptions {
    checkExecution?: boolean,
    enableProgress?: boolean,
    message?: string
}

export interface IPromiseAction {
    promiseActionType: string;
    promiseActionEvent: 'OnStart' | 'OnEnd' | 'OnError';
    promiseActionMessage?: string,
    promiseActionError?: any;
}

export interface PromiseAction extends IPromiseAction, Redux.Action { }

export const createPromiseAction = <TParms, TResult>(
    actionName: string,
    promise: (parms: TParms) => Promise<TResult>,
    resultAction: (res: TResult, parms?: TParms) => any,
    options?: CreatePromiseActionOptions): CreatePromiseAction<TParms> => {

    let create: CreatePromiseAction<TParms> = (parms?: TParms) => (
        {
            type: actionName,
            isPromiseAction: true,
            payload: Object.assign({}, options, {
                promiseParms: parms,
                promise: promise(parms),
                resultAction: resultAction
            })
        }
    )

    create.matchAction = <TPayLoad>(action: Redux.Action): action is PromiseAction =>
        (<PromiseAction>action).promiseActionType === actionName;

    create.matchOnStart = <TPayLoad>(action: Redux.Action): action is PromiseAction =>
        (<PromiseAction>action).promiseActionType === actionName &&
        (<PromiseAction>action).promiseActionEvent === 'OnStart';

    create.matchOnEnd = <TPayLoad>(action: Redux.Action): action is PromiseAction =>
        (<PromiseAction>action).promiseActionType === actionName &&
        (<PromiseAction>action).promiseActionEvent === 'OnEnd';

    create.matchOnError = <TPayLoad>(action: Redux.Action): action is PromiseAction =>
        (<PromiseAction>action).promiseActionType === actionName &&
        (<PromiseAction>action).promiseActionEvent === 'OnError';

    return create;
}