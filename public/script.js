
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

var script = (async function () {

    // Init

    $('loading').css('opacity', 1);

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

    const analytics = getAnalytics(fbApp);

    const fbAuth = getAuth(fbApp);
    const ghAuthProvider = new GithubAuthProvider();

    var credentials = Realm.Credentials.anonymous();

    var user;

    onAuthStateChanged(fbAuth, async (result) => {
        if (result) {
            ghSignIn(result);
        } else {
            console.log('Signed out of Firebase');
            user = await app.logIn(credentials);
        }
    });

    var authProvider = app.currentUser.identities[0].providerType;

    // Hash detection UI changes

    const hashes = ['#', '#people', '#messages', '#groups', '#teams', '#projects']

    hashChange();

    // MAIN SCRIPT STRATS

    signedInStyleSheet(authProvider != 'anon-user');

    if (authProvider == 'anon-user') {
        $('.item-signed-in-only').each(function () {
            $(this).css('display', 'none');
        });
        $('#sign-out').removeClass('sign-out');
        $('#sign-out').addClass('sign-in');
        $('#sign-out').html('Sign In');
        $('#sign-out').attr('id', 'sign-in');
    }

    setTimeout(() => {
        $('.loading-container').css('width', '5vh');
        $('.loading-container').css('height', '5vh');
        $('.loading-container').css('border-radius', '50%');
        $('.loading-container').css('opacity', 0);
        $('.loading-container').css('margin-bottom', '125vh');
        setTimeout(() => {
            $('#loading-master').remove();
        }, 750);
    }, 750);

    $(window).on('hashchange', function () {
        hashChange();
    });

    $('#sign-in').on('click', function () {
        // change to sign in popup later
        signInWithPopup(fbAuth, ghAuthProvider)
            .then((result) => {
                ghSignIn(result)
            }).catch((error) => {
                console.error(error);
            });
        return false;
    });

    $('#sign-out').on('click', function () {
        logOut();
        return false;
    });

    function hashChange() {
        $(function () {
            const hash = location.hash == '' ? '#' : location.hash
            if (hashes.includes(hash)) {
                $('.nav-link').each(function () {
                    if (($(this).attr('href') || '') == hash) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
                $('.content-main').each(function () {
                    if ('#' + ($(this).attr('id') || '').replace('home', '').replace('-pane', '') == hash) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            } else {
                location.hash = '#'
            }
        });
    }

    function signedInStyleSheet(bool) {
        if (bool) {
            $('link[href="./public/user-dropdown/user-dropdown-signed-in.css"]').attr('rel', 'stylesheet');
            $('link[href="./public/user-dropdown/user-dropdown-signed-out.css"]').attr('rel', 'alternate stylesheet');
        } else {
            $('link[href="./public/user-dropdown/user-dropdown-signed-out.css"]').attr('rel', 'stylesheet');
            $('link[href="./public/user-dropdown/user-dropdown-signed-in.css"]').attr('rel', 'alternate stylesheet');
        }
    }

    async function ghSignIn(result) {
        console.log(result)
        const ghCredentials = GithubAuthProvider.credentialFromResult(result);
        if (ghCredentials) {
            const ghToken = ghCredentials.accessToken;
            const ghUser = result.user;
            result.user.getIdToken(true).then(function (token) {
                console.log('Sign in with GitHub success.')
                console.log(ghCredentials);
                console.log(ghToken);
                console.log(ghUser);
                console.log(token);
                jwtSignIn(token).then((user) => {
                    console.log("Successfully logged in with JWT through Realm!", user);
                });
            }).catch(function (error) {
                alert('Sign in failed (Firebase - Get ID Token JWT, ${error.code}): ${error.message}');
                console.log(ghCredentials);
                console.log(ghToken);
                console.log(ghUser);
                jwtSignIn(ghToken).then((user) => {
                    console.log("Successfully logged in with JWT through Realm!", user);
                });
            });
        }
    }

    async function jwtSignIn(jwt) {
        credentials = Realm.Credentials.jwt(jwt);
        try {
            user = await app.logIn(credentials);
            console.assert(user.id === app.currentUser.id);
            return user;
        } catch (err) {
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

})();