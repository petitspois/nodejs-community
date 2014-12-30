/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-14 19:29
 */


define(function (require, exports, module) {
    'use strict';

    var List = require('../../widget/admin/List.js');
    var ajax = require('../../widget/common/ajax.js');
    var hashbang = require('../../alien/core/navigator/hashbang.js');
    var selector = require('../../alien/core/dom/selector.js');
    var methods = {};




    // 选择读状态
    methods.onchange = function () {
        list.query.type = this.$data.type;
        list.getList();
        hashbang.set('query', 'type', this.$data.type);
    };


    // 标记已读
    methods.toggle = function (item) {
        ajax({
            method: item.hasActived ? 'put' : 'delete',
            url: '/admin/api/notification/',
            data: {
                id: item.id
            }
        });
        item.hasActived = !item.hasActived;
        increse(item.hasActived ? -1 : 1);
    };


    require('../../widget/admin/header.js');
    require('../../widget/admin/sidebar.js');

    var type = hashbang.get('query', 'type') || 'unactive';
    var list = new List('#list', '#pagination', {
        url: '/admin/api/notification/',
        query: {
            type: type,
            limit: 2
        },
        data: {
            type: type
        },
        methods: methods
    });


    /**
     * 改变当前未读通知数量
     * @param count
     */
    function increse(count) {
        var $notification = selector.query('#notification')[0];

        if (!$notification) {
            return;
        }

        var $number = selector.query('span', $notification)[0];
        var number = Number($number.innerHTML);

        number += count;
        $number.innerHTML = String(number);
    }
});