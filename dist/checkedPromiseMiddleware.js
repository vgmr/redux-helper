"use strict";

var _validFunction = function _validFunction(obj) {
    return obj && typeof obj === 'function';
};
var _validAction = function _validAction(object) {
    return object && object instanceof Object && !(object instanceof Array) && typeof object !== "function" && typeof object.type === "string";
};
var checkedPromiseMiddleware = function checkedPromiseMiddleware(options) {
    return function (_ref) {
        var dispatch = _ref.dispatch;
        var getState = _ref.getState;
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

                if (!promise || typeof promise.then !== 'function' || !resultAction) {
                    return next(action);
                }
                if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState())) {
                    return;
                }
                if (enableProgress && _validFunction(opts.onStart)) {
                    var actStart = opts.onStart(message);
                    if (_validAction(actStart)) dispatch(actStart);
                }
                return promise.then(function (response) {
                    resultAction && dispatch(resultAction(response));
                }, function (error) {
                    if (_validFunction(opts.onError)) {
                        var actToDispatch = opts.onError(error);
                        if (_validAction(actToDispatch)) dispatch(actToDispatch);
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