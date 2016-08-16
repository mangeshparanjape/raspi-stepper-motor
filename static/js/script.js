$(function () {
    var socket = io.connect(), //we connect by using a websocket
        ui = {
            forward: $('.btn-forward'),
            backward: $('.btn-backward'),
            initMotor: $('.btn-init'),
            all: $('.btn')
        },
        params = {},
        activeClass = 'is-active',
        isPressed = false;

    //we listen to key pressing
    $('.btn-init').click(function(e) {
        params.rpm= $('#rpm');
        params.pin1= $('#pin1');
        params.pin2= $('#pin2');
        params.speed= $('#speed');
        params.steps= $('#steps');
        params.clip= $('#clip');
        params.direction= $('#direction');
        
        socket.emit('init', params);
    });
    $(document).keydown(function (e) {
        //ignores other keys pressed if a key is already pressed
        //we do this in order to avoid sending out several commands
        //when we keep the key pressed
        if (isPressed) return;

        isPressed = true;
        switch (e.which) {
            case 38: //code for the key w
                socket.emit('move', 'forward');
                ui.forward.addClass(activeClass);
                break;
            case 40: //code for the key a
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
