import * as mocha from "mocha";
import * as expect from "expect";
import * as lib from "../src";
import { createStore, applyMiddleware, Reducer, Store, Action } from "redux";

const result = lib.createAction<string>('RESULT');
const promise = lib.createPromiseAction('PROMISE_ACTION', (val: string) => Promise.resolve<string>(`${val} for test`), result);
const onStart = lib.createAction<string>('ON_START');

type ActModel = {
  type?: string;
  actionType?: string,
  actionParams?: any,
  actionEvent?: 'OnStart' | 'OnEnd' | 'OnError';
}

interface IAppState {
  linked?: ActModel,
  promise?: ActModel,
  result?: string
}

const initialState: IAppState = {};

const reducer: Reducer<IAppState> = (state: IAppState, action: Action) => {
  let retState = initialState;

  if (onStart.matchAsLinkedPromiseAction(action)) {
    retState = {
      ...state,
      ...retState,
      linked: {
        type: action.type,
        actionType: action.promiseActionType,
        actionParams: action.promiseActionParams,
        actionEvent: action.promiseActionEvent
      }
    }
  }

  if (promise.matchOnStart(action)) {
    retState = {
      ...state,
      ...retState,
      promise: {
        type: action.type,
        actionType: action.promiseActionType,
        actionParams: action.promiseActionParams,
        actionEvent: action.promiseActionEvent
      }
    }
  }
  if (result.matchAction(action)) {
    retState = {
      ...state,
      result: action.payload
    }
  }

  return retState;
};

describe("checked promise", () => {
  let store: Store<IAppState>;

  const initStore = () => {
    store = createStore<IAppState>(
      reducer,
      applyMiddleware(lib.checkedPromiseMiddleware({ onStart }))
    );
  };

  describe("match as linked actions", () => {

    before(() => {
      initStore();
      store.dispatch(promise('A Test'));
    });

    it("should match promise", () => {
      console.log('state', store.getState());
      const { linked, promise } = store.getState();

      expect(linked).toExist();
      expect(promise).toExist();

      expect(linked).toEqual(promise);
      expect(linked && linked.actionParams).toEqual('A Test');
    });

  });

});