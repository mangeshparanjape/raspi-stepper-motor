var async = require("async"),
    path = require('path'),
    stopAll = true,
    bCount = 0,
    breathHandle = 0,
    EventEmitter = require("events").EventEmitter,
    ee = new EventEmitter(),
    stepperWiringpi = require('stepper-wiringpi'),
    omxp = require('omxplayer-controll'),
    clip = '/home/stepper-ctrl/raspi-stepper-motor/sound/SnoringMale.mp3',
    soundClip = __dirname + '/sound/SnoringMale.mp3',
    dryRun = true;

//motor and music functions
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

var sequenceLoop = function () {
    stopAll = false;
    bCount = 0;
    breathHandle = 0;
    _sequenceStart();
};

var stopAll = function () {
    stopAll = true;
};

var motor1, motor2, motor3;
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

    forward: function (motorNumber, cb) {
        try {
            if (!dryRun) {
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
            cb(true);
        }
        catch (e) {
            console.log(e);
            cb(false);
        }
    },

    backward: function (motorNumber, cb) {
        try {
            if (!dryRun) {
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
            cb(true);
        }
        catch (e) {
            console.log(e);
            cb(false);
        }
    },

    stop: function (motorNumber, cb) {
        try {
            if (!dryRun) {
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
            }
            cb(true);
        }
        catch (e) {
            cb(false);
        }
    },
    stopAll: function (cb) {
        try {
            if (!dryRun) {
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
            }
            cb(true);
        }
        catch (e) {
            cb(false);
        }
    },

    playMusic: function () {
        //p.play();
    },

    stopMusic: function () {
        //p.pause();
    }
};

//sequence funcions
var _sequenceStart = function () {
    _breathLoop(function (flag) {
        _moveUp(function () {
            _moveNeck(function () {
                _moveDown(function () {
                    console.log("Finish Cycle");
                    if (!stopAll) {
                        if (ee) {
                            ee.emit('restart');
                        }
                    }
                })
            });
        });
    });
};

var _breathLoop = function (cb) {
    //breathing
    console.log("Breathing start");
    breathHandle = setInterval(
        _breathing,
        5000,
        cb
    )
};

var _breathing = function (cb) {
    //console.log("Breathing start");
    /*setTimeout(function () {
        console.log("breath out");
        if(!dryRun) controller.forward(3);
    }, 3000);

    setTimeout(function () {
        console.log("breath in");
        if(!dryRun) controller.backward(3);
    }, 6000);

    setTimeout(function () {
        //breath loop check
        _breathLoopTest(cb);
    }, 9000);*/
    console.log("breath out");
    controller.forward(3, function () {
        console.log("breath in");
        controller.backward(3, function () {

        });
    });
    _breathLoopTest(cb);
}

var _breathLoopTest = function (cb) {
    bCount++;
    console.log(bCount);
    if (bCount == 5 | stopAll) {
        clearInterval(breathHandle);
        breathHandle = 0;
        cb(true);
    };
};

var _moveUp = function (cb) {
    /*setTimeout(function () {
        console.log("Move Up");
        if(!dryRun) controller.forward(1);
        cb(true);
    }, 5000);*/
    console.log("Move Up");
    controller.forward(1, function () {
        setTimeout(function () {
            console.log("wait after move up");
            cb(true);
        }, 10000);
    });
};

var _moveNeck = function (cb) {
    /*setTimeout(function () {
        console.log("Move neck left");
        if (!dryRun) controller.forward(2);
    }, 5000);
    setTimeout(function () {
        console.log("wait after neck left");
    }, 10000);
    setTimeout(function () {
        console.log("Move neck right");
        if (!dryRun) controller.backward(2);
        cb(true);
    }, 15000);
    setTimeout(function () {
        console.log("wait after neck right");
    }, 20000);*/
    console.log("Move neck left");
    controller.forward(2, function () {
        console.log("wait after neck left");
        setTimeout(function () {
            console.log("Move neck right");
            controller.backward(2, function () {
                setTimeout(function () {
                    console.log("wait after neck right");
                    cb(true);
                }, 20000);
            });
        }, 10000);
    });

};

var _moveDown = function (cb) {
    /*setTimeout(function () {
        console.log("Move down");
        if (!dryRun) controller.backward(1);
        cb(true);
    }, 8000);*/
    controller.backward(1, function () {
        cb(true);
    });
};

ee.on("restart", function () {
    console.log("Restarted");
    sequenceLoop();
});

ee.on("stopAll", function () {
    console.log("Stop ALl");
    stopAll = true;
});

exports.sequenceLoop = sequenceLoop;
exports.stopAll = stopAll;
exports.controller = controller;

