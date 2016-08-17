"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createAction = function (actionName) {
    var create = function create(payload) {
        return { type: actionName, payload: payload };
    };
    create.matchAction = function (action) {
        return action.type === actionName;
    };
    return create;
};
exports.createCheckedAction = function (actionName, promise, resultAction, opts) {
    return function (parms) {
        return {
            type: actionName,
            payload: _extends({}, opts, {
                promise: promise(parms),
                resultAction: resultAction
            })
        };
    };
};
exports.checkedPromiseMiddleware = function (opts) {
    return function (middleware) {
        return function (next) {
            return function (action) {
                if (!action || !action.payload) return next(action);
                var _action$payload = action.payload;
                var _action$payload$check = _action$payload.checkStatus;
                var checkStatus = _action$payload$check === undefined ? false : _action$payload$check;
                var loadingMessage = _action$payload.loadingMessage;
                var promise = _action$payload.promise;
                var resultAction = _action$payload.resultAction;

                if (!promise || typeof promise.then !== 'function' || !resultAction) {
                    return next(action);
                }
                /*
                    if (checkStatus && getStatus(getState()) != null) {
                        console.log('check status prevent dispatch!');
                        return;
                    };
                */
                if (loadingMessage && opts.setStatusMessageAction) {
                    middleware.dispatch(opts.setStatusMessageAction(loadingMessage));
                }
                promise.then(function (res) {
                    return resultAction && middleware.dispatch(resultAction(res));
                }).then(function () {
                    return loadingMessage && opts.setStatusMessageAction && middleware.dispatch(opts.setStatusMessageAction());
                }).catch(function (err) {
                    return opts.trhowErrorAction && middleware.dispatch(opts.trhowErrorAction(err));
                });
            };
        };
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.checkedPromiseMiddleware;
//# sourceMappingURL=index.js.map