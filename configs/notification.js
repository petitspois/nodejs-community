/*!
 * 通知配置
 * @author ydr.me
 * @create 2014-12-13 17:07
 */

'use strict';

var Template = require('ydr-template');
var fs = require('fs');
var path = require('path');

module.exports = function(app){
    return {
        comment: {
            subject: '新评论提醒',
            template:_template('comment.html')
        },
        reply: {
            subject: '新回复提醒',
            template:_template('reply.html')
        },
        favorite: {
            subject: '收藏提醒',
            template:_template('favorite.html')
        },
        apply: {
            subject: '申请提醒',
            template:_template('apply.html')
        },
        follow: {
            subject: '新评论',
            template:_template('follow.html')
        },
        at: {
            subject: '提到你了',
            template:_template('at.html')
        },
        score: {
            subject: '加分提醒',
            template:_template('score.html')
        },
        color: {
            subject: '加色提醒',
            template:_template('color.html')
        },
        essence: {
            subject: '设置精华',
            template:_template('essence.html')
        },
        recommend: {
            subject: '设置推荐',
            template:_template('recommend.html')
        },
        update: {
            subject: '更新提醒',
            template:_template('update.html')
        },
        accepted: {
            subject: '采纳提醒',
            template:_template('accepted.html')
        },
        certificated: {
            subject: '认证提醒',
            template:_template('certificated.html')
        },
        weibo: {
            subject: '认证提醒',
            template:_template('weibo.html')
        },
        role: {
            subject: '权限变动提醒',
            template:_template('role.html')
        }
    };
};

/**
 * 读取模板
 * @param file
 * @private
 */
function _template(file){
    file = path.join(__dirname, '../templates/', file);

    var template = fs.readFileSync(file, 'utf8');

    return new Template(template);
}