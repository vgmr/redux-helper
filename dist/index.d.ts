/**
 * This Module will be exported to a package.
 */
import * as Redux from 'redux';
export declare class ReducerHost<T> {
    private handlers;
    private initialState;
    constructor(initialState: T);
    register(actionType: string, reducer: (state: T, action: Redux.Action) => T): void;
    reducer: () => (state: T, action: Action<any>) => T;
}
export declare function reducer<T>(initialState: T, handlers: {
    [type: string]: (state: T, action: Action<any>) => T;
}): () => (state: T, action: Action<any>) => T;
export interface Action<T> extends Redux.Action {
    payload: T;
}
export declare function actionCreator<T>(type: string, payload: T): {
    type: string;
    payload: T;
};
