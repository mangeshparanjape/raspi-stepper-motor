var express = require('express'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    app = express(),
    stepperWiringpi = require('stepper-wiringpi'),
    omxp = require('omxplayer-controll')
clip = '/home/stepper-ctrl/raspi-stepper-motor/sound/SnoringMale.mp3';
var opts = {
    'audioOutput': 'local', //  'hdmi' | 'local' | 'both' 
    'blackBackground': false, //false | true | default: true 
    'disableKeys': true, //false | true | default: false 
    'disableOnScreenDisplay': true, //false | true | default: false 
    'disableGhostbox': true, //false | true | default: false 
    'subtitlePath': '', //default: "" 
    'startAt': 0, //default: 0 
    'startVolume': 0.8 //0.0 ... 1.0 default: 1.0 
};
omxp.on('finish', function () {
    console.log('============= Finished =============');
    //omxp.open(clip, opts);
});

//sp = require('stream-player');


//we use the port 3000
app.set('port', 3000);

//we serve the static files of the directory /static
app.use(express.static(path.join(__dirname, '/static')));

//we create the server
var http = http.createServer(app).listen(app.get('port'), function () {
    console.log('Server was started by using the port ' + app.get('port'));
});

//we initialise socket.io
var io = require('socket.io')(http);

var motor1, motor2, motor3;
//var p;
//p.add(__dirname + '/sound/DrumMachine.mp3');
var controller = {
    params1: {
        rpm: 200,
        pin1: 23,
        pin2: 24,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    },
    params2: {
        rpm: 200,
        pin1: 27,
        pin2: 22,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    },
    params3: {
        rpm: 200,
        pin1: 17,
        pin2: 18,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    },

    init: function (pr1, pr2, pr3) {
        motor1 = null;
        motor2 = null;
        motor3 = null;
        if (pr1) {
            this.params1.rpm = parseInt(pr1.rpm, 10);
            this.params1.pin1 = parseInt(pr1.pin1, 10);
            this.params1.pin2 = parseInt(pr1.pin2, 10);
            this.params1.speed = parseInt(pr1.speed, 10);
            this.params1.steps = parseInt(pr1.steps, 10);
            this.params1.clip = pr1.clip;
            this.params1.direction = pr1.direction;
        }
        if (pr2) {
            this.params2.rpm = parseInt(pr2.rpm, 10);
            this.params2.pin1 = parseInt(pr2.pin1, 10);
            this.params2.pin2 = parseInt(pr2.pin2, 10);
            this.params2.speed = parseInt(pr2.speed, 10);
            this.params2.steps = parseInt(pr2.steps, 10);
            this.params2.clip = pr2.clip;
            this.params2.direction = pr2.direction;
        }
        if (pr3) {
            this.params3.rpm = parseInt(pr3.rpm, 10);
            this.params3.pin1 = parseInt(pr3.pin1, 10);
            this.params3.pin2 = parseInt(pr3.pin2, 10);
            this.params3.speed = parseInt(pr3.speed, 10);
            this.params3.steps = parseInt(pr3.steps, 10);
            this.params3.clip = pr3.clip;
            this.params3.direction = pr3.direction;
        }
        motor1 = stepperWiringpi.setup(this.params1.rpm, this.params1.pin1, this.params1.pin2);
        motor1.setSpeed(this.params1.speed);
        motor2 = stepperWiringpi.setup(this.params2.rpm, this.params2.pin1, this.params2.pin2);
        motor2.setSpeed(this.params2.speed);
        motor3 = stepperWiringpi.setup(this.params3.rpm, this.params3.pin1, this.params3.pin2);
        motor3.setSpeed(this.params3.speed);

        console.log("create motor objects");
        console.log("set motor speed");
    },

    forward: function (motorNumber) {
        try {
            if (motorNumber == "3") {
                motor3.step(this.params3.steps, function () {
                });
                omxp.open(clip, opts);
            }
            if (motorNumber == "1") {
                motor1.step(this.params1.steps, function () {
                });

            }
            if (motorNumber == "2") {
                motor2.step(this.params2.steps, function () {
                });

            }
        }
        catch (e) {
            console.log(e);
        }
    },

    backward: function (motorNumber) {
        try {
            if (motorNumber == "3") {
                motor.step((this.params3.steps * -1), function () {
                });
                omxp.open(clip, opts);
            }
            if (motorNumber == "1") {
                motor1.step((this.params1.steps * -1), function () {
                });
            }
            if (motorNumber == "2") {
                motor2.step((this.params2.steps * -1), function () {
                });
            }

        }
        catch (e) {
            console.log(e);
        }
    },

    stop: function (motorNumber) {
        if (motorNumber == "1") {
            try {
                console.log("Stop  motor 1");
                motor1.stop();

            }
            catch (e) {
                console.log("Stop motor 1 error - " + e);
            }
        }

        if (motorNumber == "2") {
            try {
                console.log("Stop motor 2");

                motor2.stop();

            }
            catch (e) {
                console.log("Stop motor 2 error - " + e);
            }
        }

        if (motorNumber == "3") {
            try {
                console.log("Stop motor 3");

                motor3.stop();
            }
            catch (e) {
                console.log("Stop motor 3 error - " + e);
            }
        }
    },
    stopAll: function () {
        try {
            console.log("Stop  motor 1");
            motor1.stop();

        }
        catch (e) {
            console.log("Stop motor 1 error - " + e);
        }
        try {
            console.log("Stop motor 2");

            motor2.stop();

        }
        catch (e) {
            console.log("Stop motor 2 error - " + e);
        }
        try {
            console.log("Stop motor 3");

            motor3.stop();
        }
        catch (e) {
            console.log("Stop motor 3 error - " + e);
        }
    },

    playMusic: function () {
        //p.play();
    },

    stopMusic: function () {
        //p.pause();
    }
};


//we listen to new connections
io.sockets.on('connection', function (socket) {
    //we listen the movement signal
    socket.on('move', function (direction, motorNumber) {
        switch (direction) {
            case 'forward':
                console.log("Forward");
                controller.forward(motorNumber);
                break;
            case 'backward':
                console.log("Backward");
                controller.backward(motorNumber);
                break;
        }
    });
    socket.on('init', function (params1, params2, params3) {
        controller.init(params1, params2, params3);
        //console.log(params);
    });
    //we listen to the stop signal1
    socket.on('stop', function (motorNumber) {
        console.log("Stop event fired");
        controller.stop(motorNumber);
    });

    socket.on('stopall', function () {
        console.log("Stop event fired");
        controller.stopAll();
    });
});

//test code: we initialise the motor controller1
//controller.init();
