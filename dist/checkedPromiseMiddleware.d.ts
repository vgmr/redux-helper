import { Action, Dispatch, MiddlewareAPI } from 'redux';
export interface CheckedPromiseMiddlewareOptions {
    onStart?: (message?: string) => Action;
    onEnd?: () => Action;
    onError?: (error?: any) => Action;
    shouldExecute?: (state: any) => boolean;
}
declare const checkedPromiseMiddleware: (options?: CheckedPromiseMiddlewareOptions) => (midlapi: MiddlewareAPI<any>) => (next: Dispatch<any>) => (action: any) => any;
export default checkedPromiseMiddleware;
