/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

var random = require('ydr-util').random;
var dato = require('ydr-util').dato;
var typeis = require('ydr-util').typeis;
var howdo = require('howdo');
var object = require('../../services/').object;
var developer = require('../../services/').developer;
var column = require('../../services/').column;
var section = require('../../services/').section;
var filter = require('../../utils/').filter;
var log = require('ydr-log');

module.exports = function (app) {
    var exports = {};

    /**
     * home 页
     * @param req
     * @param res
     * @param next
     */
    exports.getHome = function (req, res, next) {
        var statistics = {};
        var data = {
            title: '主页',
            statistics: statistics,
            section: section
        };

        howdo
            // 版块
            .task(function (done) {
                section.find({}, function (err, datas) {
                    if (err) {
                        return done(err);
                    }

                    app.locals.$section = data.section = datas;
                    done();
                });
            })
            // 注册用户数
            .task(function (done) {
                developer.count({}, function (err, count) {
                    if (err) {
                        return done(err);
                    }

                    statistics.engineers = count;
                    done();
                });
            })
            // objectCount 最活跃的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-objectCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestActive = dp;
                    done();
                });
            })
            // viewByCount 最大人气的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-viewByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestPopularity = dp;
                    done();
                });
            })
            // commentCount 最积极的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-commentCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestInitiative = dp;
                    done();
                });
            })
            // commentByCount 最热门的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-commentByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestHot = dp;
                    done();
                });
            })
            // agreeByCount 最受欢迎的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-agreeByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestWelcome = dp;
                    done();
                });
            })
            // acceptByCount 最受崇敬的用户
            .task(function (done) {
                developer.findOne({}, {sort: '-acceptByCount'}, function (err, dp) {
                    if (err) {
                        return done(err);
                    }

                    statistics.bestRespect = dp;
                    done();
                });
            })
            .together(function (err) {
                if (err) {
                    return next(err);
                }

                app.locals.$section.forEach(function (sec) {
                    data.section[sec.uri] = sec;
                });

                res.render('front/home.html', data);
            });
    };


    /**
     * list 页
     */
    exports.getList = function (section) {
        return function (req, res, next) {
            var category = req.params.category;
            var columnId = req.params.column;
            var label = req.params.label;
            var status = req.params.status;
            var author = req.params.author;
            var listOptions = filter.skipLimit(req.params);
            var conditions = {
                section: section.id,
                isDisplay: true
            };
            var categoryMap = {};
            var data = {
                section: section,
                title: section.name,
                categories: app.locals.$category,
                categoryMap: categoryMap,
                choose: {}
            };
            //var isPjax = req.headers['x-request-as'] === 'pjax';
            var categoryId = 0;
            dato.each(app.locals.$category, function (index, _category) {
                if (_category.uri === category) {
                    categoryId = _category.id;
                }

                categoryMap[_category.id] = _category;
            });

            if (categoryId) {
                data.choose.category = conditions.category = categoryId;
            }

            if (label) {
                data.choose.label = conditions.labels = label;
            }


            var countOptions = {};
            if (status === 'resolved') {
                data.choose.status = 'resolved';
                listOptions.nor = {acceptByResponse: null};
                countOptions.nor = {acceptByResponse: null};
            } else if (status === 'unresolved') {
                data.choose.status = 'unresolved';
                conditions.acceptByResponse = null;
            }

            var onnext = function () {
                howdo
                    // 统计数量
                    .task(function (done) {
                        object.count(conditions, countOptions, done);
                    })
                    // 列表
                    .task(function (done) {
                        listOptions.populate = ['author', 'contributors'];
                        listOptions.sort = {publishAt: -1};
                        object.find(conditions, listOptions, done);
                    })
                    // 查找 columns
                    .task(function (done) {
                        column.find({
                            author: res.locals.$developer.id
                        }, done);
                    })
                    // 异步并行
                    .together(function (err, count, docs, columns) {
                        if (err) {
                            return next(err);
                        }

                        data.columnsMap = {};

                        columns.forEach(function (item) {
                            data.columnsMap[item.id] = item;
                        });

                        data.objects = docs;
                        data.pager = {
                            page: listOptions.page,
                            limit: listOptions.limit,
                            count: count
                        };

                        //if(isPjax){
                        //    return res.json({
                        //        code: 200,
                        //        data: data
                        //    });
                        //}

                        res.render('front/list-' + section.uri + '.html', data);
                    });
            };

            if (author) {
                // 查找作者
                developer.findOne({
                    githubLogin: author
                }, function (err, de) {
                    if (err) {
                        return next(err);
                    }

                    if (!de) {
                        return next();
                    }

                    data.choose.author = de.githubLogin;
                    data.choose.authorNickname = de.nickname;
                    conditions.author = de.id.toString();
                    onnext();
                });
            } else {
                onnext();
            }
        };
    };


    /**
     * ID 303 => uri
     * @param req
     * @param res
     * @param next
     */
    exports.redirect = function (req, res, next) {
        var id = req.query.id;

        object.findOne({
            _id: id,
            isDisplay: true
        }, function (err, doc) {
            if (err) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }
            }

            var sectionMap = {};
            app.locals.$section.forEach(function (sec) {
                sectionMap[sec.id] = sec;
            });

            res.redirect('/' + sectionMap[doc.section].uri + '/' + doc.uri + '.html');
        });
    };


    /**
     * post 页
     * @param type
     * @returns {Function}(req, res, next)
     */
    exports.getObject = function (section) {
        return function (req, res, next) {
            var uri = req.params.uri;
            var data = {};

            object.findOne({
                section: section.id,
                uri: uri,
                isDisplay: true
            }, {populate: ['author', 'category']}, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (!doc) {
                    return next();
                }

                object.increaseViewByCount({_id: doc.id}, 1, log.holdError);
                data.title = doc.title;
                data.object = doc;
                res.render('front/object-' + section.uri + '.html', data);
            });
        };
    };

    return exports;
};
