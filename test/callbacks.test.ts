import * as expect from "expect";
import * as lib from "../src";
import { createStore, applyMiddleware, Reducer, Store } from "redux";

export const promiseActionStart = lib.createAction<string | undefined>(
    "PROMISE_ACTION_START"
);
export const promiseActionEnd = lib.createAction("PROMISE_ACTION_END");
export const promiseActionError = lib.createAction<{ message?: string }>(
    "PROMISE_ACTION_ERROR"
);

const opts: lib.CheckedPromiseMiddlewareOptions = {
    onStart: promiseActionStart,
    onEnd: promiseActionEnd,
    onError: promiseActionError
};

interface IAppState {
    onStartParams?: string;
    onEndParams?: string;
    onErrorParams?: any;
    onSuccess?: string;
}

const initialState: IAppState = {};

const error = new Error("error1");

const promiseAction = lib.createPromiseAction(
    "PROMISE_ACTION",
    (arg: string) => {
        return arg !== "FORCEERROR"
            ? Promise.resolve((arg || "").toUpperCase())
            : Promise.reject(error);
    }, "AutoResult"
);

const reducer: Reducer<IAppState> = (
    state = initialState,
    action: lib.Action<any>
) => {
    if (promiseAction.matchOnStart(action)) {
        return {
            ...state,
            onStartParams: action.promiseActionParams
        };
    } else if (promiseAction.matchOnEnd(action)) {
        return {
            ...state,
            onEndParams: action.promiseActionParams
        };
    } else if (promiseAction.matchOnError(action)) {
        return {
            ...state,
            onErrorParams: action.promiseActionParams
        };
    } else if (promiseAction.matchOnSuccess(action)) {
        return {
            ...state,
            onSuccess: action.payload
        };
    };
    return state;
}

describe("callback (promise actions)", () => {
    let store: Store<IAppState>;

    const recreateStore = () => {
        store = createStore<IAppState, any, any, any>(
            reducer,
            applyMiddleware(lib.checkedPromiseMiddleware(opts))
        );
    };

    describe("success in promise", () => {
        let promiseActionParams: string;

        before((done) => {
            promiseActionParams = "bbb";
            recreateStore();
            store.dispatch(promiseAction(promiseActionParams, (res, params) => {
                console.log(`Callback result is: ${res}`);
                console.log(`Callback parameters are: ${params}`);
                done();
            }));
        });

        it("state.onStartParams should match action params", () => {
            expect(store.getState().onStartParams).toBe(promiseActionParams);
        });

        it("state.onEndParameters should action params", () => {
            expect(store.getState().onEndParams).toBe(promiseActionParams);
        });

        it("state.onSuccess should be valid", () => {
            expect(store.getState().onSuccess).toBe(promiseActionParams.toUpperCase());
        });

    });

    describe("error in promise", () => {
        let promiseActionParams: string;

        before((done) => {
            promiseActionParams = "FORCEERROR";
            recreateStore();
            store.dispatch(promiseAction(promiseActionParams, (res, params) => {
                console.log("Should not be seen!");
                done();
            }));
            done();
        });

        it("state.onStartParams should match action params", () => {
            expect(store.getState().onStartParams).toBe(promiseActionParams);
        });

        it("state.onEndParameters should be undefined", () => {
            expect(store.getState().onEndParams).toBe(undefined);
        });
        it("state.onErrorParameters should be action params", () => {
            expect(store.getState().onErrorParams).toBe(promiseActionParams);
        });
        it("state.onSuccess should be undefined", () => {
            expect(store.getState().onSuccess).toBeUndefined();
        });
    });
});