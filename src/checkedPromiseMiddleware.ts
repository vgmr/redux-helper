import {Action, Dispatch, MiddlewareAPI} from 'redux';
import {PromiseAction, IPromiseAction} from './actionCreators'

export interface CheckedPromiseMiddlewareOptions {
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    onError?: (error?: any) => Action;
    shouldExecute?: (state: any) => boolean;
}

const _validFunction = (obj: any): boolean => {
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
        promise = undefined as Promise<any>,
        resultAction
    } = action.payload;

    if (!promise || typeof promise.then !== 'function' || !_validFunction(resultAction)) {
        return next(action);
    }

    const {dispatch, getState} = midlapi;

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