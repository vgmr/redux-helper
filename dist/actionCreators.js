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
//# sourceMappingURL=actionCreators.js.map