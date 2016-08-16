"use strict";
// Option 1, using ReducerHost class
var ReducerHost = (function () {
    function ReducerHost(initialState) {
        var _this = this;
        this.handlers = {};
        this.reducer = function () {
            return function (state, action) {
                if (state === void 0) { state = _this.initialState; }
                var reducer = _this.handlers[action.type];
                if (reducer) {
                    return reducer(state, action);
                }
                else {
                    return state;
                }
            };
        };
        this.initialState = initialState;
    }
    ReducerHost.prototype.register = function (actionType, reducer) {
        this.handlers[actionType] = reducer;
    };
    return ReducerHost;
}());
exports.ReducerHost = ReducerHost;
// Option 2, using a reducer function.
function reducer(initialState, handlers) {
    return function () {
        return function (state, action) {
            if (state === void 0) { state = initialState; }
            var reducer = handlers[action.type];
            if (reducer) {
                return reducer(state, action);
            }
            else {
                return state;
            }
        };
    };
}
exports.reducer = reducer;
function actionCreator(type, payload) {
    return {
        type: type,
        payload: payload
    };
}
exports.actionCreator = actionCreator;
//# sourceMappingURL=index.js.map