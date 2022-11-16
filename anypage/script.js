
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

var script = (async function () {

    // Init

    $('loading').css('opacity', 1);

    var init = false;

    if (localStorage.getItem('accessibility') == null) {
        $('link[href="./accessibility/style.css"]').attr('rel', 'stylesheet');
        localStorage.setItem('accessibility', 'false');
    } else if (localStorage.getItem('accessibility') == 'true') {
        $('link[href="./accessibility/style.css"]').attr('rel', 'alternate stylesheet');
    } else {
        $('link[href="./accessibility/style.css"]').attr('rel', 'stylesheet');
    }

    window.addEventListener('keyup', function (e) {
        if (!e.shiftKey && e.altKey) {
            console.log(e.key)
            switch (e.key) {
                case 'a': case 'å':
                    if ($('link[href="./accessibility/style.css"]').attr('rel') != 'stylesheet') {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'stylesheet');
                        localStorage.setItem('accessibility', 'false');
                    } else {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'alternate stylesheet');
                        localStorage.setItem('accessibility', 'true');
                    }
                    break;
                case 'c': case 'ç':
                    const show = $('body').css('display') != 'block';
                    // console.log('shortcut pressed from iframe', show);
                    if (show) {
                        $('html').css('background', 'rgba(40, 45, 50, 1)');
                        $('body').css('display', 'block');
                    } else {
                        $('html').css('background', 'rgba(40, 45, 50, 0)');
                        $('body').css('display', 'none');
                    }
                    break;
                case 'r': case '®':
                    location.reload();
            }
        }
    });

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
                console.error(error);
            });
        } else {
            signedInUserChange(false);
            removeLoadingElement();
        }
    });

    // MAIN SCRIPT STRATS

    function signedInUserChange(bool, result) {
        if (bool) {
            $('#main-in').css('display', 'flex');
            $('#main-out').css('display', 'none');
        } else {
            $('#main-out').css('display', 'flex');
            $('#main-in').css('display', 'none');
        }
        welcomeChange();
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
        $('#chat-id').on('keypress', function (e) {
            if (e.which == 13) {
                if ($('#chat-id').val().search(/[a-z][a-z][0-9][0-9][0-9][0-9]/i) == 0) {
                    location.href = './chat.html?type=gc&id=' + $('#chat-id').val();
                } else {
                    alert('Invalid chat ID. (Must be 6 characters long and start with 2 letters (lowercase), followed by 4 numbers.)');
                }
            }
        });
        $('#username').on('keypress', function (e) {
            if (e.which == 13) {
                location.href = './chat.html?type=dm&username=' + $('#username').val();
            }
        });
        $('#user-id').on('keypress', function (e) {
            if (e.which == 13) {
                location.href = './chat.html?type=dm&id=' + $('user-id').val();
            }
        });
        $('#join-gc').on('click', function () {
            if ($('#chat-id').val().search(/[a-z][a-z][0-9][0-9][0-9][0-9]/i) == 0) {
                location.href = './chat.html?type=gc&id=' + $('#chat-id').val();
            } else {
                alert('Invalid chat ID. (Must be 6 characters long and start with 2 letters (lowercase), followed by 4 numbers.)');
            }
        });
        $('#join-dm-username').on('click', function () {
            location.href = './chat.html?type=dm&username=' + $('#username').val();
        });
        $('#join-dm-id').on('click', function () {
            location.href = './chat.html?type=dm&id=' + $('user-id').val();
        });
    }

    function welcomeChange() {
        if (fbAuth.currentUser != null) {
            $('#welcome').html('Welcome back, <br>' + fbAuth.currentUser.displayName + '!');
        } else {
            $('#welcome').html('Welcome!');
        }
    }

    async function ghSignIn(result) {
        // console.log('ghResult', result.user ?? 'no data')
        jwtSignIn(result.user.accessToken).then(() => {
            // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
        }).catch(async (error) => {
            signedInUserChange(false);
            console.error(error);
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