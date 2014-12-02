/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

module.exports = function(app, ctrlApi){
    app.post('/api/user/login/', ctrlApi.user.login);
    app.put('/api/oss/', ctrlApi.oss.put);
};