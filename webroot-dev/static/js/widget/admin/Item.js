/*!
 * 列表项目
 * @author ydr.me
 * @create 2014-12-19 15:19
 */


define(function (require, exports, module) {
    'use strict';

    var ajax = require('../common/ajax.js');
    var alert = require('../common/alert.js');
    var confirm = require('../common/confirm.js');
    var tip = require('../common/tip.js');
    var selector = require('../../alien/core/dom/selector.js');
    var ui = require('../../alien/ui/');
    var Editor = require('../../alien/ui/Editor/');
    var dato = require('../../alien/utils/dato.js');
    var controller = require('../../alien/utils/controller.js');
    var defaults = {
        url: '/admin/api/object/',
        id: '',
        section: '',
        hiddenSelector: '#hidden'
    };
    var Item = ui.create(function (formSelector, contentSelector, options, methods) {
        var the = this;

        the._formSelector = formSelector;
        the._contentSelector = contentSelector;
        the._methods = methods;
        the._options = dato.extend({}, defaults, options);
        the._init();
    });


    /**
     * 初始化
     * @returns {Item}
     * @private
     */
    Item.fn._init = function () {
        var the = this;

        the._initData();

        return the;
    };


    /**
     * 初始化数据
     * @private
     */
    Item.fn._initData = function () {
        var the = this;

        ajax({
            url: the._options.url + (the._options.id ? '?id=' + the._options.id : '')
        }).on('success', the._onsuccess.bind(the)).on('error', alert);
    };


    /**
     * 数据载入回调
     * @param data
     * @returns {*}
     * @private
     */
    Item.fn._onsuccess = function (data) {
        var the = this;

        the.emit('success', data);

        data.object = data.object || {
            content: '',
            uri: '',
            labels: [],
            section: the._options.section,
            isDisplay: true
        };
        data.categories.forEach(function (item) {
            item.text = item.name;
            item.value = item.id;

            if (item.uri === 'default' && !data.object.category) {
                data.object.category = item.id;
            }
        });
        data.columns.forEach(function (item) {
            item.text = item.name;
            item.value = item.id;

            //if (item.uri === 'default' && !data.object.category) {
            //    data.object.category = item.id;
            //}
        });
        the.vue = new Vue({
            el: the._formSelector,
            data: data,
            methods: dato.extend({
                pushlabel: the._onpushlabel.bind(the),
                removelabel: the._onremovelabel.bind(the),
                save: the._onsave.bind(the)
            }, the._methods)
        });
        the.vue.$el.classList.remove('none');

        var editorUploadCallback = function (list, onprogress, ondone) {
            var fd = new FormData();
            var the = this;

            // key, val, name
            fd.append('img', list[0].file, 'img.png');

            ajax({
                url: '/admin/api/oss/',
                method: 'put',
                body: fd,
                loading: false
            })
                .on('progress', function (eve) {
                    onprogress(eve.alienDetail.percent);
                })
                .on('success', function (data) {
                    //cacheControl: "max-age=315360000"
                    //contentType: "image/png"
                    //encoding: "utf8"
                    //image: {type: "png", width: 200, height: 200}
                    //ourl: "http://s-ydr-me.oss-cn-hangzhou.aliyuncs.com/f/i/20141228233411750487888485"
                    //surl: "http://s.ydr.me/f/i/20141228233411750487888485"
                    ondone(null, [{
                        name: "img.png",
                        url: data.surl
                    }]);
                })
                .on('error', function (err) {
                    the.uploadDestroy();
                    alert(err);
                });
        };

        the.editor = new Editor(the._contentSelector, {
            id: data.id,
            uploadCallback: editorUploadCallback
        }).on('change', function (val) {
                the.vue.$data.object.content = val;
            });

        var $hidden = selector.query(the._options.hiddenSelector)[0];

        if ($hidden) {
            the.editor2 = new Editor($hidden, {
                id: data.id + '-hidden',
                uploadCallback: editorUploadCallback
            }).on('change', function (val) {
                    the.vue.$data.object.hidden = val;
                });
        }

        // 实时翻译
        the._translate();
    };


    /**
     * 添加标签
     * @private
     */
    Item.fn._onpushlabel = function () {
        var vue = this.vue;
        var object = vue.$data.object;
        var label = object.label.toLowerCase().trim();

        // 最多 5 个 labels
        if (label && object.labels.indexOf(label) === -1 && object.labels.length < 5) {
            object.labels.push(label);
            object.label = '';
        }
    };


    /**
     * 移除标签
     * @param index
     * @private
     */
    Item.fn._onremovelabel = function (index) {
        this.vue.$data.object.labels.splice(index, 1);
    };


    /**
     * 保存
     * @param eve
     * @param data
     * @private
     */
    Item.fn._onsave = function (eve, data) {
        var the = this;
        var vue = the.vue;
        var $btn = selector.closest(eve.target, '.btn')[0];

        $btn.disabled = true;
        $btn.innerHTML = '保存中……';

        ajax({
            url: the._options.url,
            method: data.id ? 'put' : 'post',
            body: data,
            loading: '保存中'
        }).on('success', function (data) {
            // 属于创建，清除之前的缓存记录，换成新的
            if (!the._options.id) {
                the.editor.clearStore();
                the._options.id = data.id;
                the.editor.setOptions('id', the._options.id);
                history.pushState('', null, location.pathname + '?id=' + data.id);
            }

            vue.$data.object = data;
            the.editor.resize();
            tip.success('保存成功');
        }).on('error', alert).on('finish', function () {
            $btn.disabled = false;
            $btn.innerHTML = '保存';
        });
    };


    /**
     * 实时翻译
     * @private
     */
    Item.fn._translate = function () {
        var xhr = null;
        var the = this;

        // 实时翻译
        the.vue.$watch('object.title', controller.debounce(function (word) {
            if (xhr) {
                xhr.abort();
            }

            xhr = ajax({
                loading: false,
                url: '/api/translate/?word=' + encodeURIComponent(word)
            }).on('success', function (data) {
                the.vue.$data.object.uri = data;
            }).on('complete', function () {
                xhr = null;
            }).xhr;
        }));
    };

    module.exports = Item;
});