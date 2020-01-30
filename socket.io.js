const SocketIO = require('socket.io');

module.exports = server => {
    const lock = { user: null, lock: false };
    const io = SocketIO(server);

    io.on('connection', socket => {
        console.log('connected');

        socket.on('new-connection', (data, cb) => {
            const { lock:editable } = lock
            cb({ editable: !editable });
        })

        socket.on('lock-state', (data, cb) => {
            const { lock:l, user } = lock;
            if(l) return cb({ success: false });
            
            const { id } = socket;
            lock.user = id;
            lock.lock = true;
            socket.broadcast.emit('update-state', { editable: false });
            cb({ success: true });
        });

        socket.on('unlock-state', (data, cb) => {
            const { lock:l, user } = lock;
            if(!l || user !== socket.id) return cb({ success: false });
            const { id } = socket;
            lock.user = null;
            lock.lock = false;
            socket.broadcast.emit('update-state', { editable: true });
            cb({ success: true });
        });

        socket.on('update-text', data => {
            const { text } = data;
            const { id } = socket;
            const { user, lock:l } = lock;
            if( l ) {
                if( user === id ) {
                    socket.broadcast.emit('update-text', { text });
                }
            }

        });

        socket.on('disconnect', () => {
            const { lock:l, user } = lock;
            const { id } = socket;
            if( l && user === id ) {
                lock.user = null;
                lock.lock = false;
                socket.broadcast.emit('update-state', { editable: true });
            }
            console.log('disconnected');
        });

    });
}