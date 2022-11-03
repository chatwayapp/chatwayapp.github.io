"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var app_1 = require("firebase/app");
var analytics_1 = require("firebase/analytics");
var auth_1 = require("firebase/auth");
var script = (function () {
    return __awaiter(this, void 0, void 0, function () {
        function hashChange() {
            $(function () {
                var hash = location.hash == '' ? '#' : location.hash;
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
        function jwtSignIn(jwt) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials, user_1, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = Realm.Credentials.jwt(jwt);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, app.logIn(credentials)];
                        case 2:
                            user_1 = _a.sent();
                            console.assert(user_1.id === app.currentUser.id);
                            return [2 /*return*/, user_1];
                        case 3:
                            err_1 = _a.sent();
                            console.error("Failed to log in", err_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function logOut() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, auth_1.signOut)(fbAuth).then(function () {
                                location.reload();
                            })["catch"](function (error) {
                                alert('Sign out failed (Firebase, ${error.code}): ${error.message}');
                            });
                            return [4 /*yield*/, app.currentUser.logOut()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var fbConfig, app, fbApp, analytics, fbAuth, ghAuthProvider, credentials, user, hashes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fbConfig = {
                        apiKey: "AIzaSyCKyB0DjjSJc1nF5lq8OITRZz7PNQtnZIg",
                        authDomain: "chatway-app.firebaseapp.com",
                        projectId: "chatway-app",
                        storageBucket: "chatway-app.appspot.com",
                        messagingSenderId: "244529046810",
                        appId: "1:244529046810:web:edd1af723ca748b5fe38a3",
                        measurementId: "G-7KRMXHEXQP"
                    };
                    app = new Realm.App({ id: 'chatwayapp-zsdqh' });
                    fbApp = (0, app_1.initializeApp)(fbConfig);
                    analytics = (0, analytics_1.getAnalytics)(app);
                    fbAuth = (0, auth_1.getAuth)(app);
                    ghAuthProvider = new auth_1.GithubAuthProvider();
                    (0, auth_1.signInWithPopup)(fbAuth, ghAuthProvider)
                        .then(function (result) {
                        var ghCredentials = auth_1.GithubAuthProvider.credentialFromResult(result);
                        var ghToken = ghCredentials.accessToken;
                        var ghUser = result.user;
                        var idToken = '';
                        result.user.getIdToken(true).then(function (token) {
                            idToken = token;
                        })["catch"](function (error) {
                            alert('Sign in failed (Firebase - Get ID Token JWT, ${error.code}): ${error.message}');
                        });
                        console.log('Sign in with GitHub success.');
                        console.log(ghCredentials);
                        console.log(ghToken);
                        console.log(ghUser);
                        console.log(idToken);
                        jwtSignIn(idToken).then(function (user) {
                            console.log("Successfully logged in with JWT through Realm!", user);
                        });
                    })["catch"](function (error) {
                        console.error(error);
                    });
                    credentials = Realm.Credentials.anonymous();
                    console.log(credentials);
                    return [4 /*yield*/, app.logIn(credentials)];
                case 1:
                    user = _a.sent();
                    console.log(user.id == app.currentUser.id ? 'logged in anonymously' : 'failed to log in');
                    console.log(user);
                    console.log(app.currentUser);
                    hashes = ['#', '#people', '#messages', '#groups', '#teams', '#projects'];
                    hashChange();
                    $(window).on('hashchange', function () {
                        hashChange();
                    });
                    $('#sign-out').click(function () {
                        logOut();
                        return false;
                    });
                    return [2 /*return*/, {
                            test: test,
                            logOut: logOut
                        }];
            }
        });
    });
})();
