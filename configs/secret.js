/*!
 * 密文
 * @author ydr.me
 * @create 2014-11-22 13:04
 */

'use strict';

var ydrUtil = require('ydr-util');

module.exports = function(app) {
    return {
        session: {
            // session 加密密钥
            secret: '12345',
            // csrf 的过期时间（单位毫秒），默认1个小时
            csrfAge: 1 * 60 * 60 * 1000
        },

        cookie: {
            options: {
                domain: '',
                path: '/',
                secure: false,
                httpOnly: true
            },
            // cookie加密密钥
            secret: '12345',

            // 会员 cookie 名称
            userKey: 'fed-user',
            // cookie有效期（单位毫秒），默认7天
            userAge: 7 * 24 * 60 * 60 * 1000,

            // 访客 cookie 名称
            visitorKey: 'fed-visitor',
            // cookie有效期（单位毫秒），默认7天
            visitorAge: 7 * 24 * 60 * 60 * 1000
        }
    };
};
