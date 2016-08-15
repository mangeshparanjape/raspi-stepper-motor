var express = require('express'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    app = express(),
    stepperWiringpi = require('stepper-wiringpi'),
    sp = require('stream-player');


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

/*var controller = function () {
    var motor,
        p = new sp();
    p.add(__dirname + '/sound/SnoringMale.mp3');
    var params = {
        rpm: 200,
        pin1: 23,
        pin2: 24,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    };
};*/


/*controller.prototype.init = function (p) {
    var _this = this;
    _this.params = p;
    _this.motor = stepperWiringpi.setup(params.rpm, params.pin1, params.pin2);
    _this.motor.setSpeed(params.speed);
};

controller.prototype.forward = function () {
    var _this = this;
    _this.motor.step(params.steps, function () {
        stopMusic();
    });
};

controller.prototype.backward = function () {
    var _this = this;
    _this.motor.step(params.steps, function () {
        stopMusic();
    });
};

controller.prototype.stop = function () {
    var _this = this;
    _this.motor.stop();
};

controller.prototype.playMusic = function () {
    var _this = this;
    _this.p.play();
};

controller.prototype.stopMusic = function () {
    var _this = this;
    _this.p.pause();
};

var c = new controller();
*/
var motor;
var p;
//p.add(__dirname + '/sound/DrumMachine.mp3');
var controller = {
    params: {
        rpm: 200,
        pin1: 23,
        pin2: 24,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    },


    init: function () {
        motor = stepperWiringpi.setup(this.params.rpm, this.params.pin1, this.params.pin2);
        motor.setSpeed(this.params.speed);
        p = new sp();
        p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3');
        console.log("create motor object");
        console.log("set motor speed");

        p.on('play end', function () {
            try {
                console.log('******************Music end*******************');
                p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3');
            }
            catch (e) {
                console.log(e);
            }
        });
    },

    forward: function () {
        try {
            //async.parallel([
            motor.step(this.params.steps, function () {
                //this.stopMusic();
                //p.pause();
            });
            //this.playMusic()
            p.play();
            //]);
        }
        catch (e) {
            console.log(e);
        }
    },

    backward: function () {
        try {
            //async.parallel([
            motor.step((this.params.steps * -1), function () {
                /*this.stopMusic();*/
                //p.pause();
            });
            //this.playMusic()
            p.play();
            //]);
        }
        catch (e) {
            console.log(e);
        }
    },

    stop: function () {
        //motor.stop();
        p.pause();
    },

    playMusic: function () {
        p.play();
    },

    stopMusic: function () {
        p.pause();
    }
};


//we listen to new connections
io.sockets.on('connection', function (socket) {
    //we listen the movement signal
    socket.on('move', function (direction) {
        switch (direction) {
            case 'forward':
                console.log("Forward");
                controller.forward();
                break;
            case 'backward':
                console.log("Backward");
                controller.backward();
                break;
        }
    });
    //we listen to the stop signal
    socket.on('stop', function (dir) {
        controller.stop();
    });
});

//we initialise the motor controller
controller.init();
