const socket = io();
const editor = document.querySelector('#editor');

socket.on('update-state', ({ editable }) => {
    console.log(editable)
    editor.disabled = !editable;
});

socket.on('update-text', ({ text }) => {
    console.log(text)
    editor.value = text;
})

socket.emit('new-connection', {}, ({editable}) => {
    editor.disabled = !editable;

});

editor.onfocus = (e) => {
    socket.emit('lock-state',{}, ({ success }) => {
        if( !success ) return;
    });
}

editor.onblur = (e) => {
    socket.emit('unlock-state',{}, ({ success }) => {
        if( !success ) return;
    });
}

editor.onkeyup = (e) => {
    const text = e.target.value;
    socket.emit('update-text', { text });
}