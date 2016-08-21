import { Action, Dispatch } from 'redux';
export interface CheckedPromiseMiddlewareOptions {
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    onError?: (error?: any) => Action;
    shouldExecute?: (state: any) => boolean;
}
declare const checkedPromiseMiddleware: (options?: CheckedPromiseMiddlewareOptions) => ({ dispatch, getState }: {
    dispatch: Dispatch<any>;
    getState: () => any;
}) => (next: Dispatch<any>) => (action: any) => any;
export default checkedPromiseMiddleware;
