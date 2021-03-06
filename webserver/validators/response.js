/*!
 * response 验证规则
 * @author ydr.me
 * @create 2014-12-02 22:28
 */

'use strict';


var configs = require('../../configs/');
var xss = require('ydr-util').xss;
var Validator = require('ydr-validator');
var validator = new Validator();
var regexp = require('../utils/').regexp;
var filter = require('../utils/').filter;
var REG_CONTENT = regexp.content(5, 5000);

validator.pushRule({
    name: 'content',
    type: 'string',
    alias: '评论内容',
    trim: true,
    minLength: 5,
    maxLength: 5000,
    regexp: REG_CONTENT,
    onafter: function (val, data) {
        val = xss.mdSafe(val);
        data.contentHTML = xss.mdRender(val, configs.safe);
        return val;
    },
    msg: {
        regexp: '内容仅支持中英文、数字，以及常用符号'
    }
});

module.exports = validator;
