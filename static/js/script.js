$(function () {
    var socket = io.connect(), //we connect by using a websocket
        ui = {
            initMotor: $('.btn-init'),
            startMotor: $('.btn-start'),
            stopMotor: $('.btn-stop')
        },
        params1 = {},
        params2 = {},
        params3 = {},
        activeClass = 'is-active',
        inactiveClass = 'is-inactive',
        move = true,
        handle;

    //we listen to button clicks
    $('.btn-init').click(function (e) {
        initAll();
    });
   
    $('.btn-start').click(function (e) {
        startAll
    });

    $('.btn-stop').click(function (e) {
        stopAll();
    });

    function initAll() {
        try {
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
        }
        catch (e) {
            $(this).removeClass(activeClass);
        }
    };

    function startAll() {
        try {
            $(this).addClass(activeClass);
            handle = setInterval(function () {
                if (move) {
                    move = false;
                    forward("1");
                }
            }, 4000);
        }
        catch (e) {
            $(this).removeClass(activeClass);
        }
    };
    function forward(motorNumber) {
        try {
            socket.emit('move', 'forward', motorNumber);
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

    function stop(motorNumber) {
        try {
            socket.emit('stop', motorNumber);
            console.log("stop motor " + motorNumber);
        }
        catch (e) { }
    };

    function stopAll() {
        try {
            $(this).addClass(activeClass);
            clearInterval(handle);
            handle = 0;
            socket.emit('stopall');
            $(this).removeClass(activeClass);
            $('.btn-start').removeClass(activeClass);
            $('.btn-init').removeClass(activeClass);
        }
        catch (e) {
            $(this).removeClass(activeClass);
        }
    };

});
