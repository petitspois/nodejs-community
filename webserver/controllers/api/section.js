/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var section = require('../../services/').section;

module.exports = function (app) {
    var exports = {};

    /**
     * 获取所有版块
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        res.json({
            code: 200,
            data: app.locals.$section
        });
    };


    /**
     * 新建/保存版块
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        var id = req.body.id;

        if(id){
            return section.findOneAndUpdate({
                _id: id
            }, req.body, function (err, doc) {
                if(err){
                    return next(err);
                }

                res.json({
                    code: 200,
                    data: doc
                });
            });
        }

        section.createOne(req.body, function (err, doc) {
            if(err){
                return next(err);
            }

            res.json({
                code: 200,
                data: doc
            });
        });
    };

    return exports;
}
