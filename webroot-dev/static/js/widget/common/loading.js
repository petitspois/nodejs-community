/*!
 * loading
 * @author ydr.me
 * @create 2014-12-15 19:47
 */


define(function (require, exports, module) {
    'use strict';

    var Msg = require('../../alien/ui/Msg/index.js');

    module.exports = function (content) {
        return new Msg({
            title: null,
            content: content || '<div class="f-text-center">加载中……</div>',
            buttons: null,
            addClass: 'm-dialog-loading'
        });
    };
});