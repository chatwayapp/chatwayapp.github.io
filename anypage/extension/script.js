
var show = true;

const style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', 'https://chatwayapp.github.io/anypage/root-style.css');
document.head.appendChild(style);

const anypage = document.createElement('chatway-anypage');
const iframe = document.createElement('iframe');
iframe.setAttribute('id', 'chatway-anypage');
iframe.setAttribute('src', 'https://chatwayapp.github.io/anypage/chat.html');
anypage.appendChild(iframe);
document.body.appendChild(anypage);

var bookmarkLauncherSetup = (function () {
    window.addEventListener('keyup', function () {
        if (!event.shiftKey && event.altKey) {
            switch (String.fromCharCode(event.keyCode)) {
                case 'C':
                    show = !show;
                    // console.log('shortcut pressed', show);
                    if (show) {
                        document.querySelector('chatway-anypage').style.display = 'block';
                    } else {
                        document.querySelector('chatway-anypage').style.display = 'none';
                    }
                case 'R':
                    document.getElementById('chatway-anypage').contentDocument.location.reload(true);
            }
        }
    });
}());