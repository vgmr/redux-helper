/**
 * This Module will be exported to a package.
 */
import * as Redux from 'redux';

// Option 1, using ReducerHost class
export class ReducerHost<T> {
    private handlers: { [type: string]: (state: T, action: Action<any>) => T } = {};
    private initialState:T;

    public constructor (initialState:T) {
        this.initialState = initialState;
    }

    public register(actionType: string, reducer: (state: T, action: Redux.Action) => T) {
        this.handlers[actionType] = reducer;
    }

    public reducer = () => {
        return (state = this.initialState , action: Action<any>) => {
            const reducer = this.handlers[action.type];
            if (reducer) {
                return reducer(state, action);
            } else {
                return state;
            }
        }
    }
}

// Option 2, using a reducer function.
export function reducer<T>(initialState:T,handlers: { [type: string]: (state: T, action: Action<any>) => T }) {
    return () => {
        return (state = initialState, action: Action<any>) => {
            const reducer = handlers[action.type];
            if (reducer) {
                return reducer(state, action);
            } else {
                return state;
            }
        }
    }
}

export interface Action<T> extends Redux.Action {
    payload: T
}

export function actionCreator<T>(type: string, payload: T) {
    return {
        type,
        payload
    }
}

