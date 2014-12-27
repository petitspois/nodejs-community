/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:04
 */


define(function (require, exports, module) {
    'use strict';

    var generator = require('../../../alien/ui/generator.js');
    var selector = require('../../../alien/core/dom/selector.js');
    var modification = require('../../../alien/core/dom/modification.js');
    var attribute = require('../../../alien/core/dom/attribute.js');
    var animation = require('../../../alien/core/dom/animation.js');
    var event = require('../../../alien/core/event/base.js');
    var dato = require('../../../alien/util/dato.js');
    var qs = require('../../../alien/util/querystring.js');
    var ajax = require('../ajax.js');
    var alert = require('../alert.js');
    var Pagination = require('../../../alien/ui/Pagination/index');
    var Respond = require('../Respond/index');
    var Template = require('../../../alien/libs/Template.js');
    var templateWrap = require('html!./wrap.html');
    var templateContainer = require('html!./container.html');
    var templateList = require('html!./list.html');
    var style = require('css!./style.css');
    var tplWrap = new Template(templateWrap);
    var tplContainer = new Template(templateContainer);
    var tplList = new Template(templateList);
    var alienClass = 'alien-ui-response';
    var defaults = {
        loading: '<div class="f-loading">加载中……</div>',
        url: {
            list: '/api/response/list/',
            post: '/admin/api/response/',
            count: '/api/response/count/',
            agree: '/admin/api/response/agree/',
            accept: '/admin/api/object/accept/'
        },
        language: {
            comment: '评论',
            reply: '回复'
        },
        query: {
            object: '',
            limit: 10,
            page: 1
        },
        respond: {
            placeholder: '期待你的回答',
            link: '#',
            text: 'markdown 编辑器使用帮助',
            avatar: '/static/img/avatar.png'
        },
        sync: {
            commentByCountClass: 'j-comment-by-count',
            replyByCountClass: 'j-reply-by-count'
        },
        acceptResponse: '',
        list: {}
    };
    var Response = generator({
        constructor: function ($parent, options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._$parent = selector.query($parent)[0];
            the._init();
        },

        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;
            var $parent = the._$parent;
            var html = tplWrap.render({
                language: the._options.language
            });

            the._replyMap = {};
            the._replyParentId = 0;
            $parent.innerHTML = html;
            the._$wrap = selector.children($parent)[0];
            the._ajaxContainer();
        },


        /**
         * 初始化容器
         * @private
         */
        _ajaxContainer: function () {
            var the = this;
            var options = the._options;
            var url = options.url.count + '?' + qs.stringify(options.query);

            the._renderContainer();
            ajax({
                url: url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    var commentByCountClass = options.sync.commentByCountClass;
                    var replyByCountClass = options.sync.replyByCountClass;
                    var data = {
                        count: json.data,
                        language: options.language,
                        commentByCountClass: commentByCountClass,
                        replyByCountClass: replyByCountClass
                    };
                    the._renderContainer(data);
                    the._paginationOptions = {
                        page: options.query.page,
                        max: Math.ceil(json.data.comment / options.query.limit)
                    };
                    the._count = json.data;

                    var nodes = selector.query('.j-flag', the._$wrap);

                    the._$respondParent = nodes[0];
                    the._$listParent = nodes[1];
                    the._$paginationParent = nodes[2];
                    the._$commentByCount = selector.query('.' + commentByCountClass);
                    the._$replyByCount = selector.query('.' + replyByCountClass);
                    the._getComment();
                    the._initEvent();
                    the._increaseCount();
                })
                .on('error', alert);
        },


        /**
         * 渲染容器
         * @param [data]
         * @private
         */
        _renderContainer: function (data) {
            var the = this;
            var html;

            if (data) {
                html = tplContainer.render(data);
            } else {
                html = '<div class="f-text-center">' + the._options.loading + '</div>';
            }

            the._$wrap.innerHTML = html;
        },


        /**
         * 初始化响应框
         * @private
         */
        _initRespond: function () {
            var the = this;
            var options = the._options;

            if (options.respond) {
                var data = dato.extend({}, options.respond, options.language);

                the._respondComment = new Respond(the._$respondParent, data);
                the._respondComment.on('submit', function (content) {
                    the._respondComment.disable();
                    the._post(content, function (err) {
                        the._respondComment.enable();

                        if (!err) {
                            the._respondComment.reset();
                        }
                    });
                });
            }
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var replyClass = '.' + alienClass + '-reply';
            var agreeClass = '.' + alienClass + '-agree';
            var acceptClass = '.' + alienClass + '-accept';
            var $parent = the._$listParent;

            event.on($parent, 'click', replyClass, the._reply.bind(the));
            event.on($parent, 'click', agreeClass, the._agree.bind(the));
            event.on($parent, 'click', acceptClass, the._accept.bind(the));
        },


        /**
         * 获取评论
         * @private
         */
        _getComment: function () {
            var the = this;

            if (!the._readyComment) {
                the._readyComment = true;
                the._initRespond();
                the._pagination = new Pagination(the._$paginationParent, the._paginationOptions);
                the._pagination.on('change', function (page) {
                    the._scrollTo(the._$listParent);
                    the._options.query.page = page;
                    the._getComment();
                });
            }

            the._ajaxComment();
        },


        _scrollTo: function ($target) {
            var top = attribute.top($target);

            animation.scrollTo(window, {
                y: top - 70
            }, {
                duration: 123
            });
        },


        /**
         * 初始化主评论
         * @private
         */
        _ajaxComment: function () {
            var the = this;
            var options = the._options;
            var url = options.url.list + '?' + qs.stringify(options.query);

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;

            the._renderComment();
            ajax({
                url: url
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    the._renderComment(dato.extend({
                        list: json.data
                    }, options.list));

                    // 渲染分页
                    if (the._pagination) {
                        the._pagination.render({
                            page: options.query.page,
                            max: Math.ceil(the._count.comment / options.query.limit)
                        });
                        the._replyMap = {};
                    }
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        _ajaxFinish: function () {
            this._isAjaxing = false;
        },


        /**
         * 渲染评论、回复列表
         * @param [data]
         * @private
         */
        _renderComment: function (data) {
            var the = this;
            var html;

            if (data) {
                html = tplList.render(data);
            } else {
                html = '<li class="f-text-center">' + the._options.loading + '</li>';
            }

            the._$listParent.innerHTML = html;
        },


        /**
         * 获取当前 response 的 ID
         * @param $node
         * @returns {*}
         * @private
         */
        _getResponseId: function ($node) {
            var itemClass = '.' + alienClass + '-item';
            var $item = selector.closest($node, itemClass)[0];

            return attribute.data($item, 'id');
        },


        /**
         * 提交评论/回复
         * @param content
         * @param callback
         * @private
         */
        _post: function (content, callback) {
            var the = this;
            var options = the._options;
            var data = {
                content: content,
                object: options.query.object
            };

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;

            if (the._replyParentId) {
                data.parent = the._replyParentId;
            }

            ajax({
                url: options.url.post,
                method: 'post',
                data: data
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        callback(new Error(json.message));
                        return alert(json);
                    }

                    json.data.author = options.list.engineer;
                    the._appendComment(json.data);

                    if (json.data.parent) {
                        the._count.reply++;
                    } else {
                        the._count.comment++;
                    }

                    the._increaseCount();
                    callback();
                })
                .on('error', function (err) {
                    callback(err);
                    alert(err);
                })
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 改变评论数量显示
         * @private
         */
        _increaseCount: function () {
            var the = this;
            var count = the._count;

            the._$commentByCount.forEach(function ($node) {
                $node.innerHTML = count.comment;
            });

            the._$replyByCount.forEach(function ($node) {
                $node.innerHTML = count.reply;
            });
        },


        /**
         * 动态追加评论
         * @api
         */
        _appendComment: function (data) {
            var the = this;
            var html = tplList.render(dato.extend({
                list: [data]
            }, the._options.list));
            var node = modification.parse(html)[0];

            modification.insert(node, the._$listParent, 'beforeend');
        },


        /**
         * 追加回复
         * @param $parent
         * @param data
         * @private
         */
        _appendReply: function ($parent, data) {
            var the = this;
            var html = tplList.render(data);
            var node = modification.parse(html)[0];

            modification.insert(node, $parent, 'beforeend');
        },


        /**
         * 增加数字
         * @param $node
         * @param count
         * @private
         */
        _increaseHTML: function ($node, count) {
            var $number = selector.query('.' + alienClass + '-number', $node)[0];
            var old = dato.parseInt($number.innerHTML, 0);

            old += count;
            $number.innerHTML = old;
        },


        /**
         * 回复
         * @private
         */
        _reply: function (eve) {
            var the = this;
            var id = the._getResponseId(eve.target);

            // 之前有打开的评论列表
            if (the._replyParentId) {
                the._toggleReply(the._replyParentId, false);
            }

            if (the._replyParentId !== id) {
                the._toggleReply(id, true);
                the._replyParentId = id;
            } else {
                the._replyParentId = 0;
            }
        },


        /**
         * 切换评论的收起与展开
         * @param id
         * @param boolean {Boolean} 是否展开
         * @private
         */
        _toggleReply: function (id, boolean) {
            var the = this;
            var $li = selector.query('#response-' + id)[0];

            if (!$li) {
                return;
            }

            if (boolean) {
                attribute.addClass($li, alienClass + '-active');
                the._ajaxReply($li, id);
            } else {
                attribute.removeClass($li, alienClass + '-active');
            }
        },


        /**
         * 加载回复
         * @param $li
         * @param id
         * @private
         */
        _ajaxReply: function ($li, id) {
            var the = this;
            var $children = selector.query('.' + alienClass + '-children', $li)[0];

            // 第 2+ 次加载
            if (the._replyMap[id]) {

            }
            // 首次加载
            else {
                the._renderReply($children);
            }
        },


        /**
         * 渲染回复
         * @param $children
         * @param [data]
         * @private
         */
        _renderReply: function ($children, data) {
            var the = this;
            var html;

            if (data) {
                html = tplList.render(data);
            } else {
                html = '<div class="f-text-center">' + the._options.loading + '</div>';
            }

            $children.innerHTML = html;
        },


        /**
         * 赞同
         * @private
         */
        _agree: function (eve) {
            var the = this;
            var $ele = eve.target;
            var id = the._getResponseId($ele);

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            the._isAjaxing = true;
            ajax({
                url: the._options.url.agree,
                method: 'post',
                data: {
                    id: id
                }
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    the._increaseHTML($ele, json.data);
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 采纳
         * @private
         */
        _accept: function (eve) {
            var the = this;
            var options = the._options;
            var $ele = eve.target;
            var id = the._getResponseId($ele);
            var method = options.acceptResponse === id ? 'delete' : 'post';

            if (the._isAjaxing) {
                return alert('正忙，请稍后再试');
            }

            ajax({
                url: options.url.accept,
                method: method,
                data: {
                    response: id,
                    object: options.query.object
                }
            })
                .on('success', function (json) {
                    if (json.code !== 200) {
                        return alert(json);
                    }

                    // 取消最佳
                    if (method === 'delete') {
                        the._acceptItem(options.acceptResponse, false);
                        options.acceptResponse = '';
                        the.emit('accept', false);
                    }
                    // 设置最佳
                    else {
                        options.acceptResponse = id;
                        the._acceptItem(id, true);

                        if (id !== json.data) {
                            the._acceptItem(json.data, false);
                        }

                        the.emit('accept', true);
                    }
                })
                .on('error', alert)
                .on('finish', the._ajaxFinish.bind(the));
        },


        /**
         * 设置/取消 item 为最佳
         * @param itemId
         * @param boolean
         * @private
         */
        _acceptItem: function (itemId, boolean) {
            var $item = selector.query('#response-' + itemId)[0];

            if (!$item) {
                return;
            }

            var className = alienClass + '-item-accepted';

            if (boolean) {
                attribute.addClass($item, className);
            } else {
                attribute.removeClass($item, className);
            }

            var $li = selector.query('.' + alienClass + '-accept-li', $item)[0];

            if (!$li) {
                return;
            }

            var $btn = selector.children($li)[0];

            if (boolean) {
                attribute.removeClass($btn, 'btn-warning');
                attribute.addClass($btn, 'btn-success');
                $btn.innerHTML = '<i class="i i-check"></i>取消最佳回答';
            } else {
                attribute.removeClass($btn, 'btn-success');
                attribute.addClass($btn, 'btn-warning');
                $btn.innerHTML = '<i class="i i-check"></i>采纳回答';
            }
        }
    });

    require('../Template-filter.js');
    modification.importStyle(style);
    module.exports = Response;
});