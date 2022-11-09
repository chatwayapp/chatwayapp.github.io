
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

    var user = await app.logIn(credentials);
    const fbUser = fbAuth.currentUser;

    if (fbUser != null && fbUser.accessToken != user.accessToken) {
        jwtSignIn(fbUser.accessToken).then(() => {
            console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
            signedInUserChange(true, { user: fbUser });
        }).catch((error) => {
            signedInUserChange(false);
            console.log(error);
        });
    } else {
        signedInUserChange(false);
    }

    // mongoDB Atlas
    const mongo = app.currentUser.mongoClient('mongodb-atlas');
    const collection = mongo.db('chatway').collection('chat');
    console.log('public chat data', await collection.findOne({ id: "aa0000" }));

    // MAIN SCRIPT STRATS

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

    function signedInUserChange(bool, result) {
        welcomeChange();
        $('#sign-in').on('click', function () {
            // change to sign in popup later
            if ($(this).attr('id') == 'sign-in') {
                signInWithPopup(fbAuth, ghAuthProvider)
                    .then((result) => {
                        ghSignIn(result)
                    }).catch((error) => {
                        console.error(error);
                    });
            }
            return false;
        });
        $('#sign-out').on('click', function () {
            console.log('asda')
            if ($(this).attr('id') == 'sign-out') {
                logOut();
            }
            return false;
        });
    }

    function welcomeChange() {
        if (fbAuth.currentUser != null) {
            $('#welcome').html('Welcome back, ' + fbAuth.currentUser.displayName + '!');
        } else {
            $('#welcome').html('Welcome!');
        }
    }

    async function ghSignIn(result) {
        console.log(result.accessToken)
        jwtSignIn(result.accessToken).then(() => {
            console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
            setTimeout(() => {
                location.reload();
            }, 250);
        }).catch(async (error) => {
            user = await app.logIn(Realm.Credentials.anonymous());
            signedInUserChange(false);
            console.log(error);
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