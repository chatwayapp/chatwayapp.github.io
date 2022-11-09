
var show = true;

var bookmarkLauncherSetup = (function () {
    window.addEventListener('keyup', function () {
        if (event.ctrlKey && event.altKey && String.fromCharCode(event.keyCode) == 'C') {
            console.log('shortcut pressed', show);
        }
    });
}());