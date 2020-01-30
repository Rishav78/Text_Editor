if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    PORT = process.env.PORT || 8000,
    path = require('path'),
    io = require('./socket.io')(server);

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

server.listen(PORT, err => {
    if(err) throw err;
    console.log(`Listening on port ${PORT}`);
});
