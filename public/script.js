"use strict";
var script = (async function () {
    // Init
    const app = new Realm.App({ id: 'chatwayapp-zsdqh' });
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    console.log(user.id == app.currentUser.id ? 'logged in anonymously' : 'failed to log in');
    console.log(user);
    console.log(app.currentUser);
    // Hash detection UI changes
    const hashes = ['#', '#people', '#messages', '#groups', '#teams', '#projects'];
    hashChange();
    $(window).on('hashchange', function () {
        hashChange();
    });
    function hashChange() {
        $(function () {
            const hash = location.hash == '' ? '#' : location.hash;
            if (hashes.includes(hash)) {
                $('.nav-link').each(function () {
                    if (($(this).attr('href') || '') == hash) {
                        $(this).addClass('active');
                    }
                    else {
                        $(this).removeClass('active');
                    }
                });
                $('.content-main').each(function () {
                    if ('#' + ($(this).attr('id') || '').replace('home', '').replace('-pane', '') == hash) {
                        $(this).addClass('active');
                    }
                    else {
                        $(this).removeClass('active');
                    }
                });
            }
            else {
                location.hash = '#';
            }
        });
    }
    function test() {
        console.log('test');
    }
    return {
        test: test
    };
})();