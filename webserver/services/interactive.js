/*!
 * 交互服务
 * @author ydr.me
 * @create 2014-12-10 14:57
 */

'use strict';

var interactive = require('../models/').interactive;


/**
 * 写入交互记录
 * @param data {Object} 写入数据
 * @param data.operator {String} 操作者 ID
 * @param data.model {String} 模型名称
 * @param data.path {String} 模型字段
 * @param data.object {String} 被操作者 ID
 * @param [data.value=0] {Number} 影响值
 * @param [data.isApprove=true] {Number} 是否通过了
 * @param [data.at] {Date} 操作时间
 * @param callback {Function} 回调
 */
exports.active = function (data, callback) {
    // 四个的组合一定是唯一的
    // 例：用户A（operator）只能关注用户（model+path）B（object）一次
    var conditions = {
        operator: data.operator,
        model: data.model,
        path: data.path,
        object: data.object
    };
    var data2 = {
        at: new Date(),
        value: data.value,
        isApprove: data.isApprove
    };

    if (data.model === 'user' || data.model === 'object') {
        // 发送邮件给被动用户
    }

    interactive.existOne(conditions, data2, function (err, newDoc, oldDoc) {
        if (err) {
            return callback(err);
        }

        if (!oldDoc) {
            return callback(err, true);
        }

        callback(err, newDoc.value !== oldDoc.value);
    });
};