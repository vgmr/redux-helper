"use strict";

var _validFunction = function _validFunction(obj) {
    return obj && typeof obj === 'function';
};
var _validAction = function _validAction(object) {
    return object && object instanceof Object && !(object instanceof Array) && typeof object !== "function" && typeof object.type === "string";
};
var checkedPromiseMiddleware = function checkedPromiseMiddleware(options) {
    return function (midlapi) {
        return function (next) {
            return function (action) {
                if (!action || !action.payload) return next(action);
                var opts = options || {};
                var _action$payload = action.payload;
                var _action$payload$check = _action$payload.checkExecution;
                var checkExecution = _action$payload$check === undefined ? false : _action$payload$check;
                var _action$payload$enabl = _action$payload.enableProgress;
                var enableProgress = _action$payload$enabl === undefined ? true : _action$payload$enabl;
                var _action$payload$messa = _action$payload.message;
                var message = _action$payload$messa === undefined ? 'loading' : _action$payload$messa;
                var _action$payload$promi = _action$payload.promise;
                var promise = _action$payload$promi === undefined ? undefined : _action$payload$promi;
                var resultAction = _action$payload.resultAction;

                if (!promise || typeof promise.then !== 'function' || !_validFunction(resultAction)) {
                    return next(action);
                }
                var dispatch = midlapi.dispatch;
                var getState = midlapi.getState;

                if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState())) {
                    return;
                }
                if (enableProgress && _validFunction(opts.onStart)) {
                    var actStart = opts.onStart(message);
                    if (_validAction(actStart)) dispatch(actStart);
                }
                return promise.then(function (response) {
                    var actResult = resultAction(response);
                    if (!_validAction(actResult)) throw new Error("Action \"" + action.type + "\" - result is not an action!");else dispatch(actResult);
                }, function (error) {
                    if (_validFunction(opts.onError)) {
                        var actError = opts.onError(error);
                        if (_validAction(actError)) dispatch(actError);
                    }
                }).then(function () {
                    if (enableProgress && _validFunction(opts.onEnd)) {
                        var actEnd = opts.onEnd();
                        if (_validAction(actEnd)) dispatch(actEnd);
                    }
                });
            };
        };
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkedPromiseMiddleware;
//# sourceMappingURL=checkedPromiseMiddleware.js.map