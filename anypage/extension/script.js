
var show = true;

const style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', 'https://chatwayapp.github.io/anypage/root-style.css');
document.head.appendChild(style);

const anypage = document.createElement('chatway-anypage');
const iframe = document.createElement('iframe');
iframe.setAttribute('src', 'https://chatwayapp.github.io/anypage/chat.html');
anypage.appendChild(iframe);
document.body.appendChild(anypage);

var bookmarkLauncherSetup = (function () {
    window.addEventListener('keyup', function () {
        if (event.ctrlKey && event.altKey && String.fromCharCode(event.keyCode) == 'C') {
            show = !show;
            console.log('shortcut pressed', show);
            if (show) {
                document.querySelector('chatway-anypage').style.display = 'block';
            } else {
                document.querySelector('chatway-anypage').style.display = 'none';
            }
        }
    });
}());