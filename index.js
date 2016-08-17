var express = require('express'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    app = express(),
    stepperWiringpi = require('stepper-wiringpi'),
    omxp = require('omxplayer-controll')
    clip = '/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3';
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
omxp.on('finish', function() {
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

var motor;
//var p;
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

    init: function (pr) {
        if (pr) {
            this.params.rpm = parseInt(pr.rpm, 10);
            this.params.pin1 = parseInt(pr.pin1, 10);
            this.params.pin2 = parseInt(pr.pin2, 10);
            this.params.speed = parseInt(pr.speed, 10);
            this.params.steps = parseInt(pr.steps, 10);
            this.params.clip = pr.clip;
            this.params.direction = pr.direction;
        }
        motor = stepperWiringpi.setup(this.params.rpm, this.params.pin1, this.params.pin2);
        motor.setSpeed(this.params.speed);
        /* p = new sp();
         p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3');*/
        console.log("create motor object");
        console.log("set motor speed");
    },

    forward: function () {
        try {
            //async.parallel([
            motor.step(this.params.steps, function () {
                //this.stopMusic();
                //p.pause();
            });
            //this.playMusic()
            /*p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3');
            p.play();*/

            //]);
            omxp.open(clip, opts);
            //omxp.setVolume(1, function(err, volume){});
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
            /* p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3');
             p.play();*/
            //]);
            omxp.open(clip, opts);
            //omxp.setVolume(1, function(err, volume){});
        }
        catch (e) {
            console.log(e);
        }
    },

    stop: function () {
        //motor.stop();
        //p.pause();
        /*omxp.pause(function(err){
            if(err) console.log(err);
            console.log("*************************************************pause");
        });*/
        /*omxp.playPause(function(err){
            console.log("*************************************************pause");
        });*/
        omxp.setVolume(0.0, function(err, volume){
            if(err) console.log(err);
            console.log("*******************" + volume);
        });
        //omxp.stop();
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
    socket.on('init', function (params) {
        controller.init(params);
        console.log(params);
    });
    //we listen to the stop signal
    socket.on('stop', function (dir) {
        controller.stop();
    });
});

//we initialise the motor controller
//controller.init();
