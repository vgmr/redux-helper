import * as Redux from 'redux';

export interface CheckedPromiseMiddlewareOptions {
    onError?: (error?: any, dispatch?: Redux.Dispatch<any>) => (void | Redux.Action);
    onStart?: (message?: string) => Redux.Action;
    onEnd?: () => Redux.Action;
    shouldExecute?: (getState: any) => boolean;
}

const _validFunction = (obj: any): boolean => {
    return obj && typeof obj === 'function';
}

const checkedPromiseMiddleware = (options?: CheckedPromiseMiddlewareOptions) => (middleware:any) => (next: Redux.Dispatch<any>) => (action: any) => {
    const {dispatch,getState} = middleware;
    
    let opts = options || {};

    if (!action || !action.payload) return next(action);
    const {
        checkExecution = false,
        enableProgress = true,
        message = 'loading',
        promise,
        resultAction
    } = action.payload;

    if (!promise || (typeof promise.then !== 'function' || !resultAction)) {
        return next(action);
    }

    if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState)) {
        console.log('check status prevent dispatch!');
        return;
    }

    if (enableProgress && _validFunction(opts.onStart)) {
        let actStart = opts.onStart(message);
        if (actStart) dispatch(actStart);
    }

    promise
        .then(res => resultAction && dispatch(resultAction(res)))
        .catch((err) => {
            if (_validFunction(opts.onError)) {
                let actToDispatch = opts.onError(err, dispatch);
                if (actToDispatch) dispatch(actToDispatch);
            }
        })
        .then(() => {
            if (enableProgress && _validFunction(opts.onEnd)) {
                let actEnd = opts.onEnd();
                if (actEnd) dispatch(actEnd);
            }
        });
}


export default checkedPromiseMiddleware;