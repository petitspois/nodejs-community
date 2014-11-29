/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var configs = require('../../configs/');
var user = require('../services/').user;
var setting = require('../services/').setting;
var ydrAliOss = require('ydr-ali-oss');
var random = require('ydr-util').random;


module.exports = function (app) {
    var exports = {};
    var settings2 = app.locals.settings2;
    var alioss = new ydrAliOss(settings2.alioss);

    exports.test1 = function (req, res, next) {
        if (configs.app.env === 'pro') {
            return next();
        }

        res.send('<!doctype html><meta charset="utf8"><iframe src="/user/oauth/authorize"></iframe>');
    };

    exports.test2Page = function (req, res, next) {
        res.render('test2.html');
    };

    exports.test2Upload = function (req, res, next) {
        alioss.upload(req, {
            object: '/test/'+ random.guid()
        }, function (err, ret) {
            if(err){
                return res.send(err.message);
            }

            res.send(JSON.stringify(ret, null, 4));
        });
    };

    return exports;
};


