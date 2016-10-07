import {
    Action,
    createAction,
    CreateAction,
    CreatePromiseAction,
    CreatePromiseActionOptions,
    createPromiseAction,
    createPromiseThunkAction,
    createPromiseWithThunkAction
} from './actionCreators';

import checkedPromiseMiddleware, { CheckedPromiseMiddlewareOptions } from './checkedPromiseMiddleware';

export default checkedPromiseMiddleware;

export {
    Action,
    checkedPromiseMiddleware,
    CheckedPromiseMiddlewareOptions,
    createAction,
    CreateAction,
    CreatePromiseAction,
    CreatePromiseActionOptions,
    createPromiseAction,
    createPromiseThunkAction,
    createPromiseWithThunkAction
}
