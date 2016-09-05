$(function () {
    var socket = io.connect, //we connect by using a websocket
        globalSocket = socket.connect('54.166.89.236:4000'),
        //globalSocket = socket.connect('localhost:4000'),
        ui = {
            initMotor: $('.btn-init'),
            startMotor: $('.btn-start'),
            stopMotor: $('.btn-stop'),
            moveMotor1: $('.btn-move1'),
            moveMotor2: $('.btn-move2'),
            moveMotor3: $('.btn-move3'),
            all: $('.btn')
        },
        params1 = {},
        params2 = {},
        params3 = {},
        params4 = {},
        activeClass = 'is-active',
        inactiveClass = 'is-inactive',
        isStopped = true,
        move = true,
        handle,
        moveMotor = true;

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

    $('.btn-move1-f').click(function (e) {
        moveMotorsF("1", this);
    });
    
    $('.btn-move1-b').click(function (e) {
        moveMotorsB("1", this);
    });

    $('.btn-move2-f').click(function (e) {
        moveMotorsF("2", this);
    });
    
    $('.btn-move2-b').click(function (e) {
        moveMotorsB("2", this);
    });

    $('.btn-move3-f').click(function (e) {
        moveMotorsF("3", this);
    });
    
    $('.btn-move3-b').click(function (e) {
        moveMotorsB("3", this);
    });

    function startSequence(t) {
        try {
            $(t).addClass(activeClass);
            console.log("Sequence start");
            /*socket.emit('sequence', function () {
                console.log("sequence start");
            });*/
            globalNotify('sequence',null);
            console.log("sequence start");
        }
        catch (e) {
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

            params4.breathLoopDelay = $('#bdelay')[0].value;
            params4.breathOut = $('#bout')[0].value;
            params4.breathIn = $('#bin')[0].value;
            params4.breathDelayCheck = $('#bdelaycheck')[0].value;
            params4.breathLoopCount = $('#bloopcount')[0].value;
            params4.moveUpDelay = $('#moveupdelay')[0].value;
            params4.moveNeckLeftDelay = $('#neckleftdelay')[0].value;
            params4.moveNeckLeftWait = $('#neckleftwait')[0].value;
            params4.moveNeckRightDelay = $('#neckrightdelay')[0].value;
            params4.moveNeckRightWait = $('#neckrightwait')[0].value;
            params4.moveDownDelay = $('#movedowndelay')[0].value;
            params4.dryrun = $('#dryrun')[0].value;

            /*socket.emit('init', params1, params2, params3, function () {
                console.log("done");
            });*/

            var  evt = {};
            evt.params1 = params1;
            evt.params2 = params2;
            evt.params3 = params3;
            evt.params4 = params4;
            globalNotify('init',evt);
            console.log("init");
        }
        catch (e) {
            $(t).removeClass(activeClass);
        }

    };

    function moveMotorsF(motorNumber, t) {
        try {
            var dir = "forward";
            /*if (moveMotor) {
                dir = "backward";
                moveMotor = false;
            }
            else {
                dir = "forward";
                moveMotor = true;
            }*/
            $(t).addClass(activeClass);
            console.log("move motor " + motorNumber);
            /*socket.emit('move', dir, motorNumber, function () {
                console.log("motor start");
                $(t).removeClass(activeClass);
            });*/

            var  evt = {};
            evt.direction = dir;
            evt.motorNumber = motorNumber;
            globalNotify('move',evt);
            console.log("move");
        }
        catch (e) {
            $(t).removeClass(activeClass);
            console.log(e);
        }

    };

    function moveMotorsB(motorNumber, t) {
        try {
            var dir = "backward";
            /*if (moveMotor) {
                dir = "backward";
                moveMotor = false;
            }
            else {
                dir = "forward";
                moveMotor = true;
            }*/
            $(t).addClass(activeClass);
            console.log("move motor " + motorNumber);
            /*socket.emit('move', dir, motorNumber, function () {
                console.log("motor start");
                $(t).removeClass(activeClass);
            });*/

            var  evt = {};
            evt.direction = dir;
            evt.motorNumber = motorNumber;
            globalNotify('move',evt);
            console.log("move");
        }
        catch (e) {
            $(t).removeClass(activeClass);
            console.log(e);
        }

    };

    function forward(motorNumber) {
        try {
            //socket.emit('move', 'forward', motorNumber);
            var  evt = {};
            evt.direction = "forward";
            evt.motorNumber = motorNumber;
            globalNotify('move',evt);
            console.log("move");

            console.log("forward");
            setTimeout(function () {
                backward(motorNumber);
            }, 4000);
        }
        catch (e) { }
    };

    function backward(motorNumber) {
        try {
            //socket.emit('move', 'backward', motorNumber);
            var  evt = {};
            evt.direction = "backward";
            evt.motorNumber = motorNumber;
            globalNotify('move',evt);
            console.log("move");

            console.log("backwards");
        }
        catch (e) { }
        setTimeout(function () {
            move = true;
        }, 4000);
    };

    function stop(motorNumber) {
        try {
            //socket.emit('stop', motorNumber);
            var  evt = {};
            evt.motorNumber = motorNumber;
            globalNotify('stop',evt);
            console.log("stop");

            console.log("stop motor " + motorNumber);
        }
        catch (e) { }
    };

    function stopAll(t) {
        try {
            $(t).addClass(activeClass);
            clearInterval(handle);
            handle = 0;
            
            //socket.emit('stopall'); //stopall event
            globalNotify('stopall',null);
            console.log("stopall");

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

    function globalNotify(evtName, evt) {
        var dt = {};
        dt.name = evtName;
        dt.data = evt;

        globalSocket.emit('EVT.notify', dt);

        console.log('*** notifying for EVT event \'%s\': ', evtName, evt);
    };

});
