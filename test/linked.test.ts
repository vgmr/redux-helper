// MIT License

// Copyright (c) 2016-17 (vgmr)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import * as mocha from "mocha";
import * as expect from "expect";
import * as lib from "../src";
import { createStore, applyMiddleware, Reducer, Store, Action } from "redux";
import { CheckedPromiseMiddlewareOptions } from "../src";
import { expectExist } from "./common";
import { linkedInit } from './linked.init';

describe("checked promise", () => {

  const TEST_STR = 'A test';

  let store: Store<linkedInit.IAppState>;

  describe("match as linked actions", () => {
    const { onStart, onEnd, promiseAction, STARTING_MESSAGE, ENDING_MESSAGE } = linkedInit;

    before(() => {
      store = linkedInit.getStore();
      store.dispatch(linkedInit.promiseAction(TEST_STR));
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