
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

var script = (async function () {

    // Init

    var init = false;

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

    const app = new Realm.App({ id: 'chatwaytest-aqoco' });
    const fbApp = initializeApp(fbConfig);

    const analytics = getAnalytics(fbApp);

    const fbAuth = getAuth(fbApp);
    const ghAuthProvider = new GithubAuthProvider();

    var credentials;
    var user;
    var fbUser;

    onAuthStateChanged(fbAuth, (result) => {
        const removeLoadingElement = () => {
            if (!init) {
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
                init = true;
            }
        };

        fbUser = result?.auth.currentUser;
        if (fbUser != null && fbUser.accessToken != user?.accessToken) {
            jwtSignIn(fbUser.accessToken).then(() => {
                // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
                signedInUserChange(true, { user: fbUser });
                removeLoadingElement();
            }).catch((error) => {
                signedInUserChange(false);
                removeLoadingElement();
                // console.log(error);
            });
        } else {
            signedInUserChange(false);
            removeLoadingElement();
        }
    });

    // mongoDB Atlas

    var mongo;
    var collection;

    // Hash detection UI changes

    const hashes = ['#', '#people', '#messages', '#groups', '#teams', '#projects']

    hashChange();

    // MAIN SCRIPT STRATS

    $(window).on('hashchange', function () {
        hashChange();
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

    function signedInUserChange(bool, result) {
        if (bool) {
            // console.log('sign in result', result);
            mongo = app.currentUser.mongoClient('mongodb-atlas');
            collection = mongo.db('chatway').collection('chat');
            $('.sidebar-username').html(result.user.displayName || fbAuth.currentUser.displayName);
            $('.sidebar-user-image').attr('src', result.user.photoURL || fbAuth.currentUser.photoURL);
            $('.item-signed-in-only').each(function () {
                $(this).css('display', 'block');
            });
            $('#user-action-button-holder').html('<a id="sign-out" class="dropdown-item sign-out">Sign Out</a>');
            $('link[href="./public/user-dropdown/user-dropdown-signed-in.css"]').attr('rel', 'stylesheet');
            $('link[href="./public/user-dropdown/user-dropdown-signed-out.css"]').attr('rel', 'alternate stylesheet');
        } else {
            $('.sidebar-username').html('Anonymous');
            $('.sidebar-user-image').attr('src', 'https://github.com/chatwayapp.png');
            $('.item-signed-in-only').each(function () {
                $(this).css('display', 'none');
            });
            $('#user-action-button-holder').html('<a id="sign-in" class="dropdown-item sign-in" href="javascript:alert("Please enable popups for sign in to work! (Signing in with redirect is currently not working on Safari 16.1+, for more info, please visit issue #6716 for firebase-js-sdk on GitHub.)")">Sign In</a>');
            $('link[href="./public/user-dropdown/user-dropdown-signed-out.css"]').attr('rel', 'stylesheet');
            $('link[href="./public/user-dropdown/user-dropdown-signed-in.css"]').attr('rel', 'alternate stylesheet');
        }
        homePanelWelcomeChange();
        $('.dropdown-item').on('click', function () {
            $('.user-dropdown').removeClass('show');
        });
        $('#sign-in').on('click', function () {
            // change to sign in popup later
            if ($(this).attr('id') == 'sign-in') {
                signInWithPopup(fbAuth, ghAuthProvider);
            }
            return false;
        });
        $('#sign-out').on('click', function () {
            // console.log('asda')
            if ($(this).attr('id') == 'sign-out') {
                logOut();
            }
            return false;
        });
    }

    function homePanelWelcomeChange() {
        if (fbAuth.currentUser != null) {
            $('#home-panel-welcome').html('Welcome back, ' + fbAuth.currentUser.displayName + '!');
        } else {
            $('#home-panel-welcome').html('Welcome!');
        }
    }

    async function ghSignIn(result) {
        // console.log(result.accessToken)
        jwtSignIn(result.accessToken).then(() => {
            // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
        }).catch(async (error) => {
            signedInUserChange(false);
            // console.log(error);
        });
    }

    async function jwtSignIn(jwt) {
        credentials = Realm.Credentials.jwt(jwt);
        try {
            user = await app.logIn(credentials);
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