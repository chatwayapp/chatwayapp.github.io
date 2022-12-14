
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

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

    const app = new Realm.App({ id: 'chatwaytest-aqoco' });
    const fbApp = initializeApp(fbConfig);

    const analytics = getAnalytics(fbApp);

    const fbAuth = getAuth(fbApp);
    const ghAuthProvider = new GithubAuthProvider();

    var credentials;
    var user;
    var fbUser;

    onAuthStateChanged(fbAuth, (result) => {
        fbUser = result?.auth.currentUser;
        if (fbUser != null && fbUser.accessToken != user?.accessToken) {
            jwtSignIn(fbUser.accessToken).then(() => {
                // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
                location.href = '..';
            }).catch((error) => {
                location.reload();
                console.error(error);
            });
        } else {
            $('#sign-in').on('click', function () {
                // change to sign in popup later
                if ($(this).attr('id') == 'sign-in') {
                    signInWithPopup(fbAuth, ghAuthProvider);
                }
                return false;
            });
        }
    });

    async function ghSignIn(result) {
        // console.log('ghResult', result.user ?? 'no data')
        jwtSignIn(result.user.accessToken).then(() => {
            // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
        }).catch(async (error) => {
            location.reload();
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

})();