"use strict";
var script = (async function () {
    // Init
    const fbConfig = {
        apiKey: "AIzaSyCKyB0DjjSJc1nF5lq8OITRZz7PNQtnZIg",
        authDomain: "chatway-app.firebaseapp.com",
        projectId: "chatway-app",
        storageBucket: "chatway-app.appspot.com",
        messagingSenderId: "244529046810",
        appId: "1:244529046810:web:edd1af723ca748b5fe38a3",
        measurementId: "G-7KRMXHEXQP"
    };
    const app = new Realm.App({ id: 'chatwayapp-zsdqh' });
    const fbApp = initializeApp(fbConfig);
    const analytics = getAnalytics(app);
    const fbAuth = getAuth(app);
    const ghAuthProvider = new GithubAuthProvider();
    signInWithPopup(fbAuth, ghAuthProvider)
        .then((result) => {
        const ghCredentials = GithubAuthProvider.credentialFromResult(result);
        const ghToken = ghCredentials.accessToken;
        const ghUser = result.user;
        var idToken = '';
        result.user.getIdToken(true).then(function (token) {
            idToken = token;
        }).catch(function (error) {
            alert('Sign in failed (Firebase - Get ID Token JWT, ${error.code}): ${error.message}');
        });
        console.log('Sign in with GitHub success.');
        console.log(ghCredentials);
        console.log(ghToken);
        console.log(ghUser);
        console.log(idToken);
        jwtSignIn(idToken).then((user) => {
            console.log("Successfully logged in with JWT through Realm!", user);
        });
    }).catch((error) => {
        console.error(error);
    });
    const credentials = Realm.Credentials.anonymous();
    console.log(credentials);
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
    $('#sign-out').click(function () {
        logOut();
        return false;
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
    async function jwtSignIn(jwt) {
        const credentials = Realm.Credentials.jwt(jwt);
        try {
            const user = await app.logIn(credentials);
            console.assert(user.id === app.currentUser.id);
            return user;
        }
        catch (err) {
            console.error("Failed to log in", err);
        }
    }
    async function logOut() {
        signOut(fbAuth).then(() => {
            location.reload();
        }).catch((error) => {
            alert('Sign out failed (Firebase, ${error.code}): ${error.message}');
        });
        await app.currentUser.logOut();
    }
    return {
        test: test,
        logOut: logOut,
    };
})();