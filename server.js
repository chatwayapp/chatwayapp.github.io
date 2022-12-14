const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

const pages = ['/', '/index.html', '/public/sign-in.html', '/public/sign-in.js', '/public/script.js', '/public/style.css', '/public/sidebar.css', '/public/user-dropdown/user-dropdown-signed-in.css', '/public/user-dropdown/user-dropdown-signed-out.css', '/anypage/index.html', '/anypage/chat.html', '/anypage/add.html', '/anypage/chat.js', '/anypage/script.js', '/anypage/style.css', '/anypage/extension/script.js', '/anypage/extension/bookmark.js', '/anypage/extension/root-style.css', '/anypage/accessibility/style.css'];

for (let i in pages) {
    app.get(pages[i], function (req, res) {
        if (pages[i] == '/') {
            res.sendFile(path.join(__dirname, '/index.html'));
        } else {
            res.sendFile(path.join(__dirname, pages[i]));
        }
    });
}

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
}); 