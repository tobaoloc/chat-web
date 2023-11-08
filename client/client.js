

const socket = io();
let room;
let nickname;
let joined = false;

$('#connect').click(function() {
    room = $('#roomId').val();
    nickname = $('#nickname').val();
    if(room!='' && nickname!='')
    {
        socket.emit('join', { room, nickname });
        joined = true;
    }
    else
        alert('Please fill in roomId and nickname!');
});
$('#send').click(function() {
    if(joined)
    {
        if($('#messages').val()!='')
        {
            socket.emit('chat_message', { room, nickname, message: $('#messages').val() });
            $('#messages').val('');
        }
    }
    else
    {
        alert('You did not join any room.')
    }
})
$('#messages').keypress(function (event) {
    if (event.keyCode === 13) {
        $('#send').click();
    }
});
socket.on('chat_message', function(msg) {
    $('#chatbox').append('<p><b>'+msg.nickname+': </b>'+msg.message+'</p>')
    // Scroll to the bottom of the chat window for new messages
    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
});

