/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function (app, ctrlFront) {
    var types = app.locals.$options.types;
    var uris = [];

    types.forEach(function (type) {
        if (uris.indexOf(type.uri) === -1 && type.isDisplay) {
            uris.push(type.uri);
        }
    });

    // user
    app.get('/user/oauth/authorize/', ctrlFront.user.oauthAuthorize);
    app.get('/user/oauth/callback/', ctrlFront.user.oauthCallback);

    // home
    app.get('/', ctrlFront.main.getHome);

    // list + detail
    uris.forEach(function (uri) {
        app.get('/' + uri + '/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'page/:page/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:scope/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:scope/page/:page/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/page/:page/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:scope/on/:label/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'in/:scope/on/:label/page/:page/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/in/:scope/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + 'on/:label/in/:scope/page/:page/', ctrlFront.main.getList(uri));
        app.get('/' + uri + '/' + ':uri.html', ctrlFront.main.getPost(uri));
    });

    // engineer
    app.get('/engineer/:engineer/', ctrlFront.user.getEngineer);
};