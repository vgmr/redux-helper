import * as mocha from "mocha";
import * as expect from "expect";
import * as lib from "../src";
import { createStore, applyMiddleware, Reducer, Store, Action } from "redux";
import { CheckedPromiseMiddlewareOptions } from "../src";
import { expectExist } from "./common";

const STARTING_MESSAGE = 'Start';
const ENDING_MESSAGE = 'End';

const onStart = lib.createAction<string>('ON_START');
const onEnd = lib.createAction<string>('ON_END');
const result = lib.createAction<string>('RESULT');
const promiseAction = lib.createPromiseAction('PROMISE_ACTION', (val: string) => Promise.resolve(`${val} for test`), result);

const MIDLWOPTS: CheckedPromiseMiddlewareOptions = {
  onEnd: (act) => onEnd(`${ENDING_MESSAGE}_${act!.type}`),
  onStart: (msg, act) => onStart(`${STARTING_MESSAGE}_${act!.type}`)
}


type ActModel = {
  type?: string;
  actionType?: string,
  actionParams?: any,
  actionEvent?: 'OnStart' | 'OnEnd' | 'OnError';
  payload?: any;
}

interface IAppState {
  linkedStart?: ActModel;
  linkedEnd?: ActModel;
  promiseStart?: ActModel;
  promiseEnd?: ActModel;
  result?: string;
}

const initialState: IAppState = {};

const reducer: Reducer<IAppState> = (state: IAppState = initialState, action: Action) => {
  let retState = undefined;

  if (onStart.matchAsLinkedPromiseAction(action, promiseAction)) {
    retState = {
      ...state,
      ...retState || {},
      linkedStart: {
        type: action.type,
        actionType: promiseAction.type,
        actionParams: action.promiseActionParams,
        payload: action.payload
      },
      result: action.payload
    }
  }

  if (onEnd.matchAsLinkedPromiseAction(action, promiseAction)) {
    retState = {
      ...state,
      ...retState || {},
      linkedEnd: {
        type: action.type,
        actionType: promiseAction.type,
        actionParams: action.promiseActionParams,
        payload: action.payload
      },
      result: action.payload
    }
  }

  if (promiseAction.matchOnStart(action)) {
    retState = {
      ...state,
      ...retState || {},
      promiseStart: {
        type: action.type,
        actionType: promiseAction.type,
        actionParams: action.promiseActionParams,
        actionEvent: action.promiseActionEvent
      }
    }
  }

  if (promiseAction.matchOnEnd(action)) {
    retState = {
      ...state,
      ...retState || {},
      promiseEnd: {
        type: action.type,
        actionType: promiseAction.type,
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

  return retState || state;
};

describe("checked promise", () => {
  const TEST_STR = 'A test';

  let store: Store<IAppState>;

  const initStore = () => {
    store = createStore<IAppState>(
      reducer,
      applyMiddleware(lib.checkedPromiseMiddleware(MIDLWOPTS))
    );
  };

  describe("match as linked actions", () => {

    before(() => {
      initStore();
      store.dispatch(promiseAction(TEST_STR));
    });

    it("should match promise", () => {
      const { linkedStart, linkedEnd, promiseStart, promiseEnd, result } = store.getState();

      expectExist(linkedStart);
      expectExist(linkedEnd);
      expectExist(promiseStart);
      expectExist(promiseEnd);

      if (!linkedStart || !linkedEnd || !promiseStart || !promiseEnd) throw Error("Linked or Promise undefined (should not never happer!)");

      expect(linkedStart.type).toEqual(onStart.type);
      expectExist(linkedStart.payload).toEqual(`${STARTING_MESSAGE}_${promiseAction.type}`);
      expectExist(linkedStart.actionType).toEqual(promiseAction.type);
      expect(linkedStart.actionParams).toEqual(TEST_STR);

      expect(linkedEnd.type).toEqual(onEnd.type);
      expectExist(linkedEnd.payload).toEqual(`${ENDING_MESSAGE}_${promiseAction.type}`);
      expectExist(linkedEnd.actionType).toEqual(promiseAction.type);
      expect(linkedEnd.actionParams).toEqual(TEST_STR);

      expect(promiseStart.type).toEqual(onStart.type);
      expect(promiseStart.actionType).toEqual(promiseAction.type);
      expect(promiseStart.actionParams).toEqual(TEST_STR);
      expect(promiseStart.actionEvent).toEqual('OnStart');

      expect(promiseEnd.type).toEqual(onEnd.type);
      expect(promiseEnd.actionType).toEqual(promiseAction.type);
      expect(promiseEnd.actionParams).toEqual(TEST_STR);
      expect(promiseEnd.actionEvent).toEqual('OnEnd');

      expect(result).toEqual(`${TEST_STR} for test`);
    });

  });

});