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

var controller= function() {
    var _this=this;
    var motor;
    p = new sp();

    //p.add(__dirname + '/sound/DrumMachine.mp3');
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

    var init = function (p) {
        _this.params = p;
        _this.motor = stepperWiringpi.setup(params.rpm, params.pin1, params.pin2);
        _this.motor.setSpeed(params.speed);
    };

    var forward = function () {
        _this.motor.step(params.steps, function () {
            stopMusic();
        });
    };

    var backward = function () {
        _this.motor.step(params.steps, function () {
            stopMusic();
        });
    };

    var stop = function () {
        _this.motor.stop();
    };

    var playMusic = function () {
        _this.p.play();
    };

    var stopMusic = function () {
        _this.p.pause();
    };
};

/*var controller = {
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
        var motor = stepperWiringpi.setup(params.rpm, params.pin1, params.pin2);
        motor.setSpeed(params.speed);
    },

    forward: function () {
        motor.step(params.steps, function () {
            stopMusic();
        });
    },

    backward: function () {
        motor.step(params.steps, function () {
            stopMusic();
        });
    },

    stop: function () {
        motor.stop();
    },

    playMusic: function () {
        p.play();
    },

    stopMusic: function () {
        p.pause();
    }
};
*/

//we listen to new connections
io.sockets.on('connection', function (socket) {
    //we listen the movement signal
    socket.on('move', function (direction) {
        switch (direction) {
            case 'forward':
                controller.forward();
                break;
            case 'backward':
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
var params= {
        rpm: 200,
        pin1: 23,
        pin2: 24,
        speed: 60,
        steps: 100,
        clip: 0,
        direction: "forward"
    };
//controller.params=params;
controller.init(params);