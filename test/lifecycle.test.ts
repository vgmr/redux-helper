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
  result?: string;
}

const initialState: IAppState = {};

const resultAction = lib.createAction<string>("RESULT_ACTION1");

const error = new Error("error1");

const promiseAction = lib.createPromiseAction<string, string>(
  "PROMISE_ACTION1",
  arg => {
    return arg !== "FORCEERROR"
      ? Promise.resolve((arg || "").toUpperCase())
      : Promise.reject(error);
  },
  resultAction
);

const reducer: Reducer<IAppState> = (
  state = initialState,
  action: lib.Action<any>
) => {
  if (resultAction.matchAction(action)) {
    return {
      ...state,
      result: action.payload
    };
  }
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
  }
  return state;
};

describe("lifecycle (promise actions)", () => {
  let store: Store<IAppState>;

  const recreateStore = () => {
    store = createStore<IAppState, any, any, any>(
      reducer,
      applyMiddleware(lib.checkedPromiseMiddleware(opts))
    );
  };

  describe("basic lifecycle", () => {
    let promiseActionParams: string;

    describe("successful round trip", () => {
      before(() => {
        recreateStore();
        promiseActionParams = "hi";

        store.dispatch(promiseAction(promiseActionParams));
      });

      it("state.result should match result", () => {
        expect(store.getState().result).toBe(promiseActionParams.toUpperCase());
      });

      it("state.onStartParams should match action parameters", () => {
        expect(store.getState().onStartParams).toBe(promiseActionParams);
      });

      it("state.onEndParameters should match action parameters", () => {
        expect(store.getState().onEndParams).toBe(promiseActionParams);
      });

      it("state.onErrorParams should be undefined", () => {
        expect(store.getState().onErrorParams).toBe(undefined);
      });
    });


    describe("error in promise", () => {
      before(() => {
        promiseActionParams = "FORCEERROR";
        recreateStore();
        store.dispatch(promiseAction(promiseActionParams));
      });

      it("state.result should be undefined", () => {
        expect(store.getState().result).toBe(undefined);
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
    });
  });
});