"use strict";

var _validFunction = function _validFunction(obj) {
    return obj && typeof obj === 'function';
};
var checkedPromiseMiddleware = function checkedPromiseMiddleware(options) {
    return function (middleware) {
        return function (next) {
            return function (action) {
                var dispatch = middleware.dispatch;
                var getState = middleware.getState;

                var opts = options || {};
                if (!action || !action.payload) return next(action);
                var _action$payload = action.payload;
                var _action$payload$check = _action$payload.checkExecution;
                var checkExecution = _action$payload$check === undefined ? false : _action$payload$check;
                var _action$payload$enabl = _action$payload.enableProgress;
                var enableProgress = _action$payload$enabl === undefined ? true : _action$payload$enabl;
                var _action$payload$messa = _action$payload.message;
                var message = _action$payload$messa === undefined ? 'loading' : _action$payload$messa;
                var promise = _action$payload.promise;
                var resultAction = _action$payload.resultAction;

                if (!promise || typeof promise.then !== 'function' || !resultAction) {
                    return next(action);
                }
                if (checkExecution && _validFunction(opts.shouldExecute) && !opts.shouldExecute(getState)) {
                    console.log('check status prevent dispatch!');
                    return;
                }
                if (enableProgress && _validFunction(opts.onStart)) {
                    var actStart = opts.onStart(message);
                    if (actStart) dispatch(actStart);
                }
                promise.then(function (res) {
                    return resultAction && dispatch(resultAction(res));
                }).catch(function (err) {
                    if (_validFunction(opts.onError)) {
                        var actToDispatch = opts.onError(err, dispatch);
                        if (actToDispatch) dispatch(actToDispatch);
                    }
                }).then(function () {
                    if (enableProgress && _validFunction(opts.onEnd)) {
                        var actEnd = opts.onEnd();
                        if (actEnd) dispatch(actEnd);
                    }
                });
            };
        };
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkedPromiseMiddleware;
//# sourceMappingURL=checkedPromiseMiddleware.js.map