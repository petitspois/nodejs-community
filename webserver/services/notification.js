/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var notification = require('../models/').notification;


/**
 * 创建一条通知
 * @type {*|exports.createOne}
 */
exports.createOne = notification.createOne;
exports.createOne = function (data, email, callback) {

};


/**
 * 设置为已激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.setActived = function (conditions, callback) {
    notification.toggle(conditions, 'hasActived', true, callback);
};

/**
 * 设置为未激活
 * @param conditions {Object} 查询条件
 * @param callback {Function} 回调
 */
exports.cancelActived = function (conditions, callback) {
    notification.toggle(conditions, 'hasActived', false, callback);
};
