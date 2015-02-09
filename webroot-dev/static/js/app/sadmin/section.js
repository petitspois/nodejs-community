/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 22:05
 */


define(function (require, exports, module) {
    'use strict';


    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    var Setting = require('../../widget/admin/Setting.js');
    new Setting('#section', {
        url: '/admin/api/section/',
        itemKey: 'section',
        listKey: 'sections',
        type: '版块'
    });
});