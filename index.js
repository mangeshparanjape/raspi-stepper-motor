var express = require('express'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    app = express(),
    motor_sequence = require('./motor_sequence');

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

//we listen to new connections
io.sockets.on('connection', function (socket) {
    //we listen the movement signal
    socket.on('init', function (params1, params2, params3) {
        motor_sequence.controller.init(params1, params2, params3);
    });

    socket.on('sequence', function () {
        motor_sequence.sequenceLoop();
    });

    socket.on('stopall', function () {
        motor_sequence.stopAll();
    });

    socket.on('stop', function (motorNumber) {
        console.log("Stop event fired");
        motor_sequence.controller.stop(motorNumber, function(){
            
        });
    });

    socket.on('move', function (direction, motorNumber) {
        switch (direction) {
            case 'forward':
                console.log("Forward");
                motor_sequence.controller.forward(motorNumber,function(){

                });
                break;
            case 'backward':
                console.log("Backward");
                motor_sequence.controller.backward(motorNumber,function(){

                });
                break;
        }
    });

});
