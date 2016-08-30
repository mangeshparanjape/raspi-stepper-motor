$(function () {
    var socket = io.connect(), //we connect by using a websocket
        ui = {
            initMotor: $('.btn-init'),
            startMotor: $('.btn-start'),
            stopMotor: $('.btn-stop'),
            all: $('.btn')
        },
        params1 = {},
        params2 = {},
        params3 = {},
        activeClass = 'is-active',
        isPressed = false;

    //we listen to key pressing
    $('.btn-init').click(function (e) {
        $(this).addClass(activeClass);
        params1.rpm = $('#m1-rpm')[0].value;
        params1.pin1 = $('#m1-pin1')[0].value;
        params1.pin2 = $('#m1-pin2')[0].value;
        params1.speed = $('#m1-speed')[0].value;
        params1.steps = $('#m1-steps')[0].value;
        params1.clip = $('#m1-clip')[0].value;
        params1.direction = $('#m1-direction')[0].value;

        params2.rpm = $('#m2-rpm')[0].value;
        params2.pin1 = $('#m2-pin1')[0].value;
        params2.pin2 = $('#m2-pin2')[0].value;
        params2.speed = $('#m2-speed')[0].value;
        params2.steps = $('#m2-steps')[0].value;
        params2.clip = $('#m2-clip')[0].value;
        params2.direction = $('#m2-direction')[0].value;

        params3.rpm = $('#m3-rpm')[0].value;
        params3.pin1 = $('#m3-pin1')[0].value;
        params3.pin2 = $('#m3-pin2')[0].value;
        params3.speed = $('#m3-speed')[0].value;
        params3.steps = $('#m3-steps')[0].value;
        params3.clip = $('#m3-clip')[0].value;
        params3.direction = $('#m3-direction')[0].value;
        //console.log(params);

        socket.emit('init', params1, params2, params3, function () {
            console.log("done");
        });

    });

    var move = true;
    $('.btn-start').click(function (e) {
        $(this).addClass(activeClass);
        var interval = setInterval(function () {
            if (move) {
                move = false;
                forward("1");
            }
        }, 4000);
    });

    function forward(motorNumber) {
        try {
            socket.emit('move', 'forward',motorNumber);
            console.log("forward");
            setTimeout(function () {
                backward(motorNumber);
            }, 4000);
        }
        catch (e) { }
    };

    function backward(motorNumber) {
        try {
            socket.emit('move', 'backward', motorNumber);
            console.log("backwards");
        }
        catch (e) { }
        setTimeout(function () {
            move = true;
        }, 4000);
    };

    /*$(document).keydown(function (e) {
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
    });*/

    //stops the motors when a key is released
    /*$(document).keyup(function (e) {
        ui.all.removeClass(activeClass);
        socket.emit('stop');
        isPressed = false;
    });*/

});
