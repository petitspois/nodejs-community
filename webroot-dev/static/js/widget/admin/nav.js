/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-20 16:06
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var Scrollbar = require('../../alien/ui/Scrollbar/');
    var dato = require('../../alien/util/dato.js');
    var app = {};
    var pathname = location.pathname.replace(/^\/admin/, '');
    var actives = [
        /^\/$/,
        /^\/setting\/type\/$/,
        /^\/setting\/scope\/$/,
        /^\/setting\/oss\/$/,
        /^\/setting\/oauth\/$/,
        /^\/setting\/website\/$/,
        /^\/object\/help\/list\/$/,
        /^\/object\/question\/list\/$/
    ];

    app.init = function () {
        ajax({
            url: '/admin/api/nav/'
        }).on('success', app._onsuccess.bind(app)).on('error', alert);
    };

    app._onsuccess = function (json) {
        if (json.code !== 200) {
            return alert(json);
        }

        var list = json.data;
        var find = 0;

        dato.each(actives, function (index, active) {
            if(active.test(pathname)){
                find = index;
                return false;
            }
        });

        list[++find].active = true;

        var vue = new Vue({
            el: '#nav',
            data: {
                list: list
            }
        });

        vue.$el.classList.remove('f-none');
        new Scrollbar('#nav');
    };

    app.init();
});