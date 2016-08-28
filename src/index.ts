import {createAction,
    createPromiseAction,
    CreateAction,
    CreatePromiseActionOptions,
    CreatePromiseAction,
    Action} from './actionCreators';

import checkedPromiseMiddleware, {CheckedPromiseMiddlewareOptions} from './checkedPromiseMiddleware';

export default checkedPromiseMiddleware;

export {
    Action,
    checkedPromiseMiddleware,
    CheckedPromiseMiddlewareOptions,
    createAction,
    createPromiseAction,
    CreatePromiseAction,
    CreateAction,
    CreatePromiseActionOptions
}
