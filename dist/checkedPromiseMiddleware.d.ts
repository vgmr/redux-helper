import * as Redux from 'redux';
export interface CheckedPromiseMiddlewareOptions {
    onError?: (error?: any, dispatch?: Redux.Dispatch<any>) => (void | Redux.Action);
    onStart?: (message?: string) => Redux.Action;
    onEnd?: () => Redux.Action;
    shouldExecute?: (getState: any) => boolean;
}
declare const checkedPromiseMiddleware: (options?: CheckedPromiseMiddlewareOptions) => (middleware: any) => (next: Redux.Dispatch<any>) => (action: any) => any;
export default checkedPromiseMiddleware;
