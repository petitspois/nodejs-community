/*!
 * oss
 * @author ydr.me
 * @create 2014-11-30 14:15
 */

'use strict';

var Oss = require('ydr-ali-oss');
var random = require('ydr-util').random;
var REG_IMAGE = /^image\/.*$/;
var configs = require('../../../configs/');

module.exports = function (app) {
    var exports = {};
    var settings = app.locals.$setting.alioss;
    settings.onbeforeput = function (fileStream, next) {
        if (!REG_IMAGE.test(fileStream.contentType)) {
            return next(new Error('只能上传图片文件'));
        }

        next();
    };
    var oss = new Oss(settings);

    /**
     * 上传图片到阿里云 OSS
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        oss.setOptions('accessKeyId', app.locals.$setting.alioss.accessKeyId);
        oss.setOptions('accessKeySecret', app.locals.$setting.alioss.accessKeySecret);
        oss.setOptions('domain', app.locals.$setting.alioss.domain);
        oss.setOptions('bucket', app.locals.$setting.alioss.bucket);
        oss.setOptions('host', app.locals.$setting.alioss.host);
        oss.put(req, {
            object: configs.dir.upload + random.guid()
        }, function (err, ret) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                message: '上传成功',
                data: ret
            });
        });
    };

    return exports;
};
