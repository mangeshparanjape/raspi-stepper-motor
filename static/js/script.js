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
        inactiveClass = 'is-inactive',
        isStopped = true,
        move = true,
        handle;

    //we listen to key pressing
    $('.btn-init').click(function (e) {
        initAll(this);
    });

    $('.btn-start').click(function (e) {
        isStopped = false;
        startSequence(this);
    });

    $('.btn-stop').click(function (e) {
        stopAll(this);
    });

    function startSequence(t) {
        try{
            $(t).addClass(activeClass);
            console.log("Sequence start");
            socket.emit('sequence', function () {
                console.log("sequence start");
            });
        } 
        catch(e){
            $(t).removeClass(activeClass);
            console.log(e);
        }
    };


    function initAll(t) {
        try {
            $(t).addClass(activeClass);
            params1.rpm = $('#m1-rpm')[0].value;
            params1.pin1 = $('#m1-pin1')[0].value;
            params1.pin2 = $('#m1-pin2')[0].value;
            params1.speed = $('#m1-speed')[0].value;
            params1.steps = $('#m1-steps')[0].value;
            params1.clip = 0;
            params1.direction = $('#m1-direction')[0].value;

            params2.rpm = $('#m2-rpm')[0].value;
            params2.pin1 = $('#m2-pin1')[0].value;
            params2.pin2 = $('#m2-pin2')[0].value;
            params2.speed = $('#m2-speed')[0].value;
            params2.steps = $('#m2-steps')[0].value;
            params2.clip = 0;
            params2.direction = $('#m2-direction')[0].value;

            params3.rpm = $('#m3-rpm')[0].value;
            params3.pin1 = $('#m3-pin1')[0].value;
            params3.pin2 = $('#m3-pin2')[0].value;
            params3.speed = $('#m3-speed')[0].value;
            params3.steps = $('#m3-steps')[0].value;
            params3.clip = 0;
            params3.direction = $('#m3-direction')[0].value;
            //console.log(params);

            socket.emit('init', params1, params2, params3, function () {
                console.log("done");
            });
        }
        catch (e) {
            $(t).removeClass(activeClass);
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

    function stopAll(t) {
        try {
            $(t).addClass(activeClass);
            clearInterval(handle);
            handle = 0;
            socket.emit('stopall'); //stopall event
            console.log("Stop all");
            $(t).removeClass(activeClass);
            $('.btn-start').removeClass(activeClass);
            $('.btn-init').removeClass(activeClass);
            isStopped = true;
        }
        catch (e) {
            $(t).removeClass(activeClass);
        }
    };
   
});
