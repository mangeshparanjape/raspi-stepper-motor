$(function () {
    var socket = io.connect(), //we connect by using a websocket
        ui = {
            forward: $('.btn-forward'),
            backward: $('.btn-backkward'),
            all: $('.btn')
        },
        activeClass = 'is-active',
        isPressed = false;

    //we listen to key pressing
    $(document).keydown(function (e) {
        //ignores other keys pressed if a key is already pressed
        //we do this in order to avoid sending out several commands
        //when we keep the key pressed
        if (isPressed) return;

        isPressed = true;
        switch (e.which) {
            case 87: //code for the key w
                socket.emit('move', 'forward');
                ui.forward.addClass(activeClass);
                break;
            case 83: //code for the key a
                socket.emit('move', 'backward');
                ui.backward.addClass(activeClass);
                break;
        }
    });

    //stops the motors when a key is released
    $(document).keyup(function (e) {
        ui.all.removeClass(activeClass);
        socket.emit('stop');
        isPressed = false;
    });
});