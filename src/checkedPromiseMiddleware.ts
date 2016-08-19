import {Action, Dispatch} from 'redux';

export interface CheckedPromiseMiddlewareOptions {
    onError?: (error?: any, dispatch?: Dispatch<any>) => (void | Action);
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    shouldExecute?: (getState: any) => boolean;
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

const checkedPromiseMiddleware = (options?: CheckedPromiseMiddlewareOptions) => ({ dispatch, getState }: { dispatch: Dispatch<any>, getState: () => any }) => (next: Dispatch<any>) => (action: any) => {
    if (!action || !action.payload) return next(action);
    let opts = options || {};
    const {
        checkExecution = false,
        enableProgress = true,
        message = 'loading',
        promise = undefined as Promise<any>,
        resultAction
    } = action.payload;

    if (!promise || typeof promise.then !== 'function' || !resultAction) {
        return next(action);
    }

    if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState)) {
        return;
    }

    if (enableProgress && _validFunction(opts.onStart)) {
        let actStart = opts.onStart(message);
        if (_validAction(actStart)) dispatch(actStart);
    }

    return promise.then(
        response => {
            resultAction && dispatch(resultAction(response))
        },
        error => {
            if (_validFunction(opts.onError)) {
                let actToDispatch = opts.onError(error, dispatch);
                if (_validAction(actToDispatch)) dispatch(actToDispatch);
            }
        }).then(() => {
            if (enableProgress && _validFunction(opts.onEnd)) {
                let actEnd = opts.onEnd();
                if (_validAction(actEnd)) dispatch(actEnd);
            }
        });
}


export default checkedPromiseMiddleware;