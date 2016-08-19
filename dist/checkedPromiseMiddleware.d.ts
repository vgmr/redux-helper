import { Action, Dispatch, MiddlewareAPI } from 'redux';
export interface CheckedPromiseMiddlewareOptions {
    onError?: (error?: any, dispatch?: Dispatch<any>) => (void | Action);
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    shouldExecute?: (getState: any) => boolean;
}
declare const checkedPromiseMiddleware: (options?: CheckedPromiseMiddlewareOptions) => (middleware: MiddlewareAPI<any>) => (next: Dispatch<any>) => (action: any) => any;
export default checkedPromiseMiddleware;
