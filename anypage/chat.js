
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

    window.addEventListener('keyup', function () {
        if (!event.shiftKey && event.altKey) {
            switch (String.fromCharCode(event.keyCode)) {
                case 'A':
                    if ($('link[href="./accessibility/style.css"]').attr('rel') != 'stylesheet') {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'stylesheet');
                        localStorage.setItem('accessibility', 'false');
                    } else {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'alternate stylesheet');
                        localStorage.setItem('accessibility', 'true');
                    }
                    break;
                case 'C':
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
                case 'R':
                    location.reload();
            }
        }
    });

    const params = new URLSearchParams(window.location.search);
    var type = params.get('type');
    var id;

    switch (type) {
        case 'gc':
            id = params.get('id');
            break;
        case 'dm':
            if (params.get('id') != null) {
                id = params.get('id');
            } else if (params.get('username') != null) {
                id = params.get('username');
            } else {
                alert('Please provide a valid id or username');
                location = '.';
            }
            break;
        default:
            alert('Please enter a valid URL');
            location = '.';
    }

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

    // mongoDB Atlas

    var mongo;
    var collection;

    // Sign In

    onAuthStateChanged(fbAuth, (result) => {
        const removeLoadingElement = () => {
            if (!init) {
                $('#message').on('keypress', function (e) {
                    if (e.which == 13) {
                        send();
                    }
                });
                $('#send').on('click', function () {
                    send();
                });
                $('#main-in').css('display', 'flex');
                document.getElementsByClassName('chat')[0].scrollTo(0, document.getElementsByClassName('chat')[0].scrollHeight);
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
                mongo = app.currentUser.mongoClient('mongodb-atlas');
                collection = mongo.db('chatway').collection('chat');
                removeLoadingElement();
            }).catch((error) => {
                location.href = '.';
            });
        } else {
            location.href = '.';
        }
    });

    async function send() {
        $('#message').val('');
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