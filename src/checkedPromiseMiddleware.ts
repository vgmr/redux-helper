import {Action, Dispatch, MiddlewareAPI} from 'redux';

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

const checkedPromiseMiddleware = (options?: CheckedPromiseMiddlewareOptions) => (midlapi : MiddlewareAPI<any>) => (next: Dispatch<any>) => (action: any) => {
    if (!action || !action.payload) return next(action);
    let opts = options || {};
    const {
        checkExecution = false,
        enableProgress = true,
        message = 'loading',
        promise = undefined as Promise<any>,
        resultAction
    } = action.payload;

    if (!promise || typeof promise.then !== 'function' || ! _validAction(resultAction)) {
        return next(action);
    }

    const {dispatch, getState} = midlapi;
    
    if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState())) {
        return;
    }

    if (enableProgress && _validFunction(opts.onStart)) {
        const actStart = opts.onStart(message);
        if (_validAction(actStart)) dispatch(actStart);
    }

    return promise.then(
        response => {
            dispatch(resultAction(response));
        },
        error => {
            if (_validFunction(opts.onError)) {
                const actToDispatch = opts.onError(error);
                if (_validAction(actToDispatch)) dispatch(actToDispatch);
            }
        }).then(() => {
            if (enableProgress && _validFunction(opts.onEnd)) {
                const actEnd = opts.onEnd();
                if (_validAction(actEnd)) dispatch(actEnd);
            }
        });
}


export default checkedPromiseMiddleware;