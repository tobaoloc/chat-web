

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

$('#start-camera').click(async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true,audio:true });

        $('#camera-stream')[0].srcObject = stream;
        $('#camera-container').show();

    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
});

