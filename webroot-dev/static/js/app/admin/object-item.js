/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 16:26
 */


define(function (require, exports, module) {
    'use strict';

    var Item = require('../../widget/admin/Item.js');
    var Tab = require('../../alien/ui/Tab/');
    var Response = require('../../widget/common/Response/');
    var selector = require('../../alien/core/dom/selector.js');
    var attribute = require('../../alien/core/dom/attribute.js');
    var app = {};

    app.tab = function () {
        var tab = new Tab('#object-tab');

        tab.on('change', function (index, $activeTab, $activeContent) {
            attribute.removeClass($activeContent, 'f-none');

            var $siblings = selector.siblings($activeContent);

            $siblings.forEach(function ($sibling) {
                attribute.addClass($sibling, 'f-none');
            });
        });
    };


    app.object = function () {
        var item = new Item('#form', '#content', {
            section: window['-section-'],
            id: window['-id-']
        });

        item.on('success', function (object, author) {
            debugger;
        });
    };


    app.response = function () {
         new Response('#response', {
            id: window['-object-'],
            query: {
                page: 1,
                limit: 3,
                object: window['-id-']
            },
            list: {
                engineer: window['-engineer-'],
                author: window['-author-'],
                object: window['-object-']
            },
            respond: {
                id: window['-object-'].id,
                avatar: window['-engineer-'].avatar
            },
            acceptResponse: window['-object-'].acceptResponse
        });
    };

    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');
    app.tab();
    app.object();
});