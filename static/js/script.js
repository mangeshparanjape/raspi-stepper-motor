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
        startAll(this);
        startSequence();
    });

    $('.btn-stop').click(function (e) {
        stopAll(this);
    });

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

    function startAll(t) {
        try {
            $(t).addClass(activeClass);
            handle = setInterval(function () {
                if (move) {
                    move = false;
                    forward("1");
                }
            }, 4000);
        }
        catch (e) {
            $(t).removeClass(activeClass);
        }
    };

    function startSequence() {
        try{
        console.log("Sequence start");

        do {
            
            //Breathing start - for 5 seconds
            var flag = 0;
            while (flag == 0) {
                 //Motor 3 step forward
                console.log("Breath out");
                sleep(1000);
                //Motor 3 step backward
                console.log("Breath in");
                setTimeout(function () {
                    flag = 1;
                }, 5000);  // 5 seconds
            }
           
            //stop motor 3 and  start motor 1
            console.log("get up")
            //delay 5 seconds
            sleep(5000);

            //turn left motor2
            console.log("turn left")
            //delay 2 seconds
            sleep(2000);
            //turn right
            console.log("turn right")
            sleep(2000);
            //move to center
            console.log("move to center");
            //5 seconds delay
            sleep(5000);

            //motor 1 get down
            console.log("Get down");
            //delay 10 seconds
            sleep(5000);
        }
        while (isStopped); //while isStopped == false
        }
        catch(e){
            console.log(e);
    
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

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

});
