
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
        if (!e.shiftKey && e.altKe && document.body == document.activeElementy) {
            switch (e.key) {
                case 'A': case 'å':
                    if ($('link[href="./accessibility/style.css"]').attr('rel') != 'stylesheet') {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'stylesheet');
                        localStorage.setItem('accessibility', 'false');
                    } else {
                        $('link[href="./accessibility/style.css"]').attr('rel', 'alternate stylesheet');
                        localStorage.setItem('accessibility', 'true');
                    }
                    break;
                case 'C': case 'ç':
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
                case 'R': case '®':
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
    var chat;

    var lastMsg = -1;

    // Sign In

    onAuthStateChanged(fbAuth, (result) => {
        const removeLoadingElement = () => {
            if (!init) {
                const watcher = (async () => {
                    for await (const change of collection.watch()) {
                        const doc = change.fullDocument;
                        for (var i = 1; i <= parseInt(Object.keys(doc).at(-1).replace('sender', '')) - lastMsg; i++) {
                            insert({
                                sender: doc['sender' + (lastMsg + i)],
                                message: doc['msg' + (lastMsg + i)]
                            });
                            lastMsg++;
                        }
                    }
                })();
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
            jwtSignIn(fbUser.accessToken).then(async () => {
                // console.log("Successfully logged in with JWT through Realm!", user, fbAuth.currentUser);
                mongo = app.currentUser.mongoClient('mongodb-atlas');
                switch (type) {
                    case 'gc':
                        collection = mongo.db('chatway').collection('rooms');
                        chat = await collection.findOne({ id: id });
                        break;
                    case 'dm':
                        if (params.get('id') != null) {
                            collection = mongo.db('chatway').collection('dms');
                            chat = await collection.findOne({ p1id: user.id }) || await collection.findOne({ p2id: user.id });
                        } else if (params.get('username') != null) {
                            collection = mongo.db('chatway').collection('dms');
                            chat = await collection.findOne({ p1: user.displayName }) || await collection.findOne({ p2: user.displayName });
                        } else {
                            alert('Invalid Request. Please report this to the developers.');
                            location = '.';
                        }
                        break;
                    default:
                        alert('Invalid Request. Please report this to the developers.');
                        location = '.';
                }
                if (chat?._id != null) {
                    var msgNum = 0;
                    while (true) {
                        const current = chat['msg' + msgNum];
                        const sender = chat['sender' + msgNum];
                        if (current != null && sender != null) {
                            insert({
                                sender: sender,
                                message: current
                            });
                            msgNum++;
                        } else {
                            lastMsg = msgNum - 1;
                            break;
                        }
                    }
                } else {
                    alert('Invalid Request. Please report this to the developers.');
                    location = '.';
                }
                removeLoadingElement();
            }).catch((error) => {
                location.href = '.';
            });
        } else {
            location.href = '.';
        }
    });

    async function send() {
        var update;
        const message = $('#message').val();
        $('#message').val('');
        switch (type) {
            case 'gc':
                update = await collection.updateOne(
                    { id: id },
                    { $set: { ['msg' + (lastMsg + 1)]: message, ['sender' + (lastMsg + 1)]: fbUser.displayName } }
                );
                break;
            case 'dm':
                if (params.get('id') != null) {
                    update = await collection.updateOne(
                        { p1id: user.id },
                        { $set: { ['msg' + (lastMsg + 1)]: message, ['sender' + (lastMsg + 1)]: fbUser.displayName } }
                    ) || await collection.updateOne(
                        { p2id: user.id },
                        { $set: { ['msg' + (lastMsg + 1)]: message, ['sender' + (lastMsg + 1)]: fbUser.displayName } }
                    );
                } else if (params.get('username') != null) {
                    update = await collection.updateOne(
                        { p1: fbUser.displayName },
                        { $set: { ['msg' + (lastMsg + 1)]: message, ['sender' + (lastMsg + 1)]: fbUser.displayName } }
                    ) || await collection.updateOne(
                        { p2: fbUser.displayName },
                        { $set: { ['msg' + (lastMsg + 1)]: message, ['sender' + (lastMsg + 1)]: fbUser.displayName } }
                    );
                } else {
                    alert('Invalid Request. Please report this to the developers.');
                }
                break;
            default:
                alert('Invalid Request. Please report this to the developers.');
        }
    }

    async function insert(data) {
        const container = document.createElement(data.sender == fbUser.displayName ? 'you' : 'them');
        const msgBox = document.createElement('msg-box');
        const msg = document.createElement('message');
        const sender = document.createElement('sender');
        msg.innerHTML = data.message;
        if (type == 'gc' && data.sender != fbUser.displayName) {
            msg.setAttribute('style', 'margin-top: 1.375rem !important;');
            sender.innerHTML = data.sender;
        }
        msgBox.appendChild(sender);
        msgBox.appendChild(msg);
        container.appendChild(msgBox);
        document.getElementsByClassName('chat')[0].appendChild(container);
        if (fbUser.displayName == data.sender) {
            document.getElementsByClassName('chat')[0].scrollTo(0, document.getElementsByClassName('chat')[0].scrollHeight);
        }
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