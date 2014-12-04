/*!
 * 启动时需要运行的
 * @author ydr.me
 * @create 2014-11-22 21:28
 */

'use strict';

var ydrUtil = require('ydr-util');
var setting = require('./services/').setting;

module.exports = function (next, app) {
    setting.get(function (err, settings) {
        if (err) {
            return next(err);
        }

        ydrUtil.dato.extend(true, app.locals, {
            settings2: settings
        });

        next(null, app);
    });
};