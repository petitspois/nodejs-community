/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');
var configs = require('../../configs/');
var log = require('ydr-util').log;
var express = require('express');
// 更为详尽配置的静态服务器
var staticOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html'],
    index: false,
    maxAge: '1d',
    redirect: true
};

log.setOptions('env', configs.app.env);
log.setOptions('path', configs.dir.log);

module.exports = function (app) {
    var exports = controllers(app);

    // 中间件：路由验证、安全验证、访问验证等
    require('./middleware.js')(app, exports.middleware);

    // 静态路由
    app.use('/', express.static(configs.dir.webroot, staticOptions));
    app.use('/static/', express.static(configs.dir.static, staticOptions));

    // 测试
    require('./test.js')(app, exports.test);

    // 管理路由
    require('./admin.js')(app, exports.admin);

    // 前端路由
    require('./front.js')(app, exports.front);

    // API 路由
    require('./api.js')(app, exports.api);

    // notFound/serverError 日志
    app.use(log());

    // 终点路由
    require('./error.js')(app, exports.error);
};