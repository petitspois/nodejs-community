/*!
 * 前端路由
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function (app, ctrl) {
    // user
    app.get('/developer/oauth/authorize/', ctrl.developer.oauthAuthorize);
    app.get('/developer/oauth/callback/', ctrl.developer.oauthCallback);


    // home
    app.get('/', ctrl.main.getHome);


    app.get('/column/:uri');


    // list + detail
    // in category at column on label as status by autho
    app.locals.$section.forEach(function (section) {
        var uri = section.uri;

        // ''
        app.get('/' + uri + '/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'page/:page/', ctrl.main.getList(section));

        // category
        app.get('/' + uri + '/' + 'in/:category/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/page/:page/', ctrl.main.getList(section));

        // column
        app.get('/' + uri + '/' + 'at/:column/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/page/:page/', ctrl.main.getList(section));

        // label
        app.get('/' + uri + '/' + 'on/:label/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/page/:page/', ctrl.main.getList(section));

        // status
        app.get('/' + uri + '/' + 'as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'as/:status/page/:page/', ctrl.main.getList(section));

        // author
        app.get('/' + uri + '/' + 'by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'by/:author/page/:page/', ctrl.main.getList(section));

        // category + column
        app.get('/' + uri + '/' + 'in/:category/at/:column/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/page/:page/', ctrl.main.getList(section));

        // category + label
        app.get('/' + uri + '/' + 'in/:category/on/:label/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/page/:page/', ctrl.main.getList(section));

        // category + status
        app.get('/' + uri + '/' + 'in/:category/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/as/:status/page/:page/', ctrl.main.getList(section));

        // category + author
        app.get('/' + uri + '/' + 'in/:category/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/by/:author/page/:page/', ctrl.main.getList(section));

        // column + label
        app.get('/' + uri + '/' + 'at/:column/on/:label/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/page/:page/', ctrl.main.getList(section));

        // column + status
        app.get('/' + uri + '/' + 'at/:column/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/as/:status/page/:page/', ctrl.main.getList(section));

        // column + author
        app.get('/' + uri + '/' + 'at/:column/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/by/:author/page/:page/', ctrl.main.getList(section));

        // label + status
        app.get('/' + uri + '/' + 'on/:label/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/as/:status/page/:page/', ctrl.main.getList(section));

        // label + author
        app.get('/' + uri + '/' + 'on/:label/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/by/:author/page/:page/', ctrl.main.getList(section));

        // status + author
        app.get('/' + uri + '/' + 'as/:status/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'as/:status/by/:author/page/:page/', ctrl.main.getList(section));

        // category + column + label
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/page/:page/', ctrl.main.getList(section));

        // category + column + status
        app.get('/' + uri + '/' + 'in/:category/at/:column/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/as/:status/page/:page/', ctrl.main.getList(section));

        // category + column + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/by/:author/page/:page/', ctrl.main.getList(section));

        // category + label + status
        app.get('/' + uri + '/' + 'in/:category/on/:label/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/as/:status/page/:page/', ctrl.main.getList(section));

        // category + label + author
        app.get('/' + uri + '/' + 'in/:category/on/:label/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/on/:label/by/:author/page/:page/', ctrl.main.getList(section));

        // category + status + author
        app.get('/' + uri + '/' + 'in/:category/as/:status/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/as/:status/by/:author/page/:page/', ctrl.main.getList(section));

        // column + label + status
        app.get('/' + uri + '/' + 'at/:column/on/:label/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/as/:status/page/:page/', ctrl.main.getList(section));

        // column + label + author
        app.get('/' + uri + '/' + 'at/:column/on/:label/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'at/:column/on/:label/by/:author/page/:page/', ctrl.main.getList(section));

        // label + status + author
        app.get('/' + uri + '/' + 'on/:label/as/:status/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'on/:label/as/:status/by/:author/page/:page/', ctrl.main.getList(section));

        // category + column + label + status
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/page/:page/', ctrl.main.getList(section));

        // category + column + label + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/by/:author/page/:page/', ctrl.main.getList(section));

        // category + column + label + status + author
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/by/:author/', ctrl.main.getList(section));
        app.get('/' + uri + '/' + 'in/:category/at/:column/on/:label/as/:status/by/:author/page/:page/', ctrl.main.getList(section));

        app.get('/object/', ctrl.main.redirect);
        app.get('/' + uri + '/' + ':uri.html', ctrl.main.getObject(section));
    });


    // developer
    app.get('/developer/:githubLogin/', ctrl.developer.home);
    app.get('/developer/:githubLogin/comment/', ctrl.developer.comment);
    app.get('/developer/:githubLogin/comment/page/:page/', ctrl.developer.comment);
    app.get('/developer/:githubLogin/comment-by/', ctrl.developer.commentBy);
    app.get('/developer/:githubLogin/comment-by/page/:page/', ctrl.developer.commentBy);
    app.get('/developer/:githubLogin/reply/', ctrl.developer.reply);
    app.get('/developer/:githubLogin/reply/page/:page/', ctrl.developer.reply);
    app.get('/developer/:githubLogin/reply-by/', ctrl.developer.replyBy);
    app.get('/developer/:githubLogin/reply-by/page/:page/', ctrl.developer.replyBy);
    app.get('/developer/:githubLogin/accept/', ctrl.developer.accept);
    app.get('/developer/:githubLogin/accept/page/:page/', ctrl.developer.accept);
    app.get('/developer/:githubLogin/accept-by/', ctrl.developer.acceptBy);
    app.get('/developer/:githubLogin/accept-by/page/:page/', ctrl.developer.acceptBy);
    app.get('/developer/:githubLogin/agree/', ctrl.developer.agree);
    app.get('/developer/:githubLogin/agree/page/:page/', ctrl.developer.agree);
    app.get('/developer/:githubLogin/agree-by/', ctrl.developer.agreeBy);
    app.get('/developer/:githubLogin/agree-by/page/:page/', ctrl.developer.agreeBy);
};