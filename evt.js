var port = process.env.EVENTER_SERVICE_PORT || process.env.EVT_PORT || 4000;
var host = process.env.EVENTER_SERVICE_HOST || 'localhost';
var socket = require('socket.io-client')('http://' + host + ':' + port);
var room = 'iot-evt';
console.log('*** EVT client is waiting for EVT server on %s:%s', host, port);

exports.reg = function (mod, cbr) {
    $ = mod;

    socket.on('connect', function () {
        console.log('*** EVT client is connected to EVT server on %s:%s', host, port);
        socket.emit('room', room);

    });

    socket.on('reconnect', function () {
        console.log('*** EVT client is re-connecting to EVT server on %s:%s...', host, port);
    });

    socket.on('event', function (data) {
        console.log('got event: ', data);
    });

    socket.on('disconnect', function () {
        console.log('disconnected from EVT server');
    });

    socket.on('EVT.event', function (evt) {
        console.log('*** received notification for event \'%s\': ', evt.name, evt.data);
        $.io.sockets.emit(evt.name, evt.data);

        if (evt.name == 'init') {
            $.motor_sequence.controller.init(evt.data.params1, evt.data.params2, evt.data.params3);
        }

        if (evt.name == 'sequence') {

            $.motor_sequence.sequenceLoop();

        }

        if (evt.name == 'stopall') {

            $.motor_sequence.stopAll();

        }

        if (evt.name == 'stop') {

            console.log("Stop event fired");
            $.motor_sequence.controller.stop(evt.data.motorNumber, function () {

            });

        }

        if (evt.name == 'move') {

            switch (evt.data.direction) {
                case 'forward':
                    console.log("Forward");
                    $.motor_sequence.controller.forward(evt.data.motorNumber, function () {

                    });
                    break;
                case 'backward':
                    console.log("Backward");
                    $.motor_sequence.controller.backward(evt.data.motorNumber, function () {

                    });
                    break;
            }

        }
    })

    exports.sct = socket;
    exports.notify = notify;

    if (cbr) {
        cbr(socket);
    }

    return mod;
};

function notify(evtname, evt, includeSelf) {
    var dt = {
        name: evtname,
        data: evt
    }
    socket.emit('EVT.notify', dt);
    try {
        if (includeSelf != null && includeSelf) {
            $.io.emit(evtname, evt);
        }
    }
    catch (e) {
        console.log(e);
    }
    console.log('*** notifying for EVT event \'%s\': ', evtname, evt);
}

