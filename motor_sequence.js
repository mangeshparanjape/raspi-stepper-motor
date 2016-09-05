var async = require("async"),
    path = require('path'),
    stopAll = true,
    bCount = 0,
    breathHandle = 0,
    EventEmitter = require("events").EventEmitter,
    ee = new EventEmitter(),
    clip = '/home/stepper-ctrl/raspi-stepper-motor/sound/SnoringMale.mp3',
    soundClip = __dirname + '/sound/SnoringMale.mp3',
    dryRun = true,
    stepperWiringpi,
    omxp;

if (!dryRun) {
    stepperWiringpi = require('stepper-wiringpi');
    omxp = require('omxplayer-controll');
}

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

/*omxp.on('finish', function () {
    console.log('============= Finished =============');
    //omxp.open(clip, opts);
});*/

var sequenceLoop = function () {
    stopAll = false;
    bCount = 0;
    breathHandle = 0;
    _newSequenceStart();
};

/*var sequenceLoop = function () {
    stopAll = false;
    bCount = 0;
    breathHandle = 0;
    _sequenceStart();
};*/

var stopAll = function () {
    stopAll = true;
};

var motor1, motor2, motor3;
var controller = {
    sequenceParams: {
        breathLoopDelay: 10000,
        breathOut: 3000,
        breathIn: 6000,
        breathDelayCheck: 9000,
        breathLoopCount: 5,
        moveUpDelay: 5000,
        moveNeckLeftDelay: 5000,
        moveNeckLeftWait: 10000,
        moveNeckRightDelay: 15000,
        moveNeckRightWait: 20000,
        moveDownDelay: 5000,
        dryRun: true
    },
    params1: {
        rpm: 200,
        pin1: 23,
        pin2: 24,
        speed: 60,
        steps: 1200,
        clip: 0,
        direction: "forward"
    },
    params2: {
        rpm: 200,
        pin1: 27,
        pin2: 22,
        speed: 60,
        steps: 400,
        clip: 0,
        direction: "forward"
    },
    params3: {
        rpm: 200,
        pin1: 17,
        pin2: 18,
        speed: 60,
        steps: 4800,
        clip: 0,
        direction: "forward"
    },

    init: function (pr1, pr2, pr3, pr4) {
        if (!dryRun) {
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
            try {
                if (pr4) {
                    this.sequenceParams.breathLoopDelay = parseInt(pr4.breathLoopDelay, 10);
                    this.sequenceParams.breathOut = parseInt(pr4.breathOut, 10);
                    this.sequenceParams.breathIn = parseInt(pr4.breathIn, 10);
                    this.sequenceParams.breathDelayCheck = parseInt(pr4.breathDelayCheck, 10);
                    this.sequenceParams.breathLoopCount = parseInt(pr4.breathLoopCount, 10);
                    this.sequenceParams.moveUpDelay = parseInt(pr4.moveUpDelay, 10);
                    this.sequenceParams.moveNeckLeftDelay = parseInt(pr4.moveNeckLeftDelay, 10);
                    this.sequenceParams.moveNeckLeftWait = parseInt(pr4.moveNeckLeftWait, 10);
                    this.sequenceParams.moveNeckRightDelay = parseInt(pr4.moveNeckRightDelay, 10);
                    this.sequenceParams.moveNeckRightWait = parseInt(pr4.moveNeckRightWait, 10);
                    this.sequenceParams.moveDownDelay = parseInt(pr4.moveDownDelay, 10);
                    this.sequenceParams.dryRun = pr4.dryRun;
                    dryRun = this.sequenceParams.dryRun;
                }
            }
            catch (e) {
                console.log(e);
            }

            motor1 = stepperWiringpi.setup(this.params1.rpm, this.params1.pin1, this.params1.pin2);
            motor1.setSpeed(this.params1.speed);
            motor2 = stepperWiringpi.setup(this.params2.rpm, this.params2.pin1, this.params2.pin2);
            motor2.setSpeed(this.params2.speed);
            motor3 = stepperWiringpi.setup(this.params3.rpm, this.params3.pin1, this.params3.pin2);
            motor3.setSpeed(this.params3.speed);

            console.log("create motor objects");
            console.log("set motor speed");
        }
    },

    forward: function (motorNumber, cb) {
        try {
            if (!dryRun) {
                if (motorNumber == "3") {
                    omxp.open(clip, opts);
                    motor3.step(this.params3.steps, function () {
                    });

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

        }
        catch (e) {
            console.log(e);

        }
        cb(true);
    },

    backward: function (motorNumber, cb) {
        try {
            if (!dryRun) {
                if (motorNumber == "3") {
                    omxp.open(clip, opts);
                    motor3.step((this.params3.steps * -1), function () {
                    });

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

        }
        catch (e) {
            console.log(e);

        }
        cb(true);
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

        }
        catch (e) {

        }
        cb(true);
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

        }
        catch (e) {

        }
        cb(true);
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

var _newSequenceStart = function () {
    console.log("breathing start");
    //breathing
    breathHandle = setInterval(
        _newBreathing,
        controller.sequenceParams.breathLoopDelay
    )
};

var _breathLoop = function (cb) {
    //breathing
    console.log("Breathing start");
    breathHandle = setInterval(
        _breathing,
        controller.sequenceParams.breathLoopDelay,
        cb
    )
};

var _breathing = function (cb) {
    //console.log("Breathing start");
    setTimeout(function () {
        console.log("breath out");
        controller.forward(3, motorCallback);
    }, controller.sequenceParams.breathOut);

    setTimeout(function () {
        console.log("breath in");
        controller.backward(3, motorCallback);
    }, controller.sequenceParams.breathIn);

    setTimeout(function () {
        //breath loop check
        _breathLoopTest(cb);
    }, controller.sequenceParams.breathDelayCheck);

    /*console.log("breath out");
    setTimeout(function () {
        controller.forward(3, function () {
            console.log("breath in");
            setTimeout(function () {
                controller.backward(3, function () {

                });
            }, 6000);

        });
    }, 3000);*/

    //_breathLoopTest(cb);
}


var _newBreathing = function (cb) {
    //console.log("Breathing start");
    controller.backward(3, function () {
        console.log("Move Up");
        controller.backward(1, function () {
            console.log("Move down");
            controller.forward(1, function () {
                console.log("Finish cycle");
                setTimeout(function () {
                    if (!stopAll) {
                        if (ee) {
                            ee.emit('restart');
                        }
                    }
                }, controller.sequenceParams.breathLoopDelay);
            });
        });
    });
}


var _breathLoopTest = function (cb) {
    bCount++;
    console.log(bCount);
    if (bCount == controller.sequenceParams.breathLoopCount | stopAll) {
        clearInterval(breathHandle);
        breathHandle = 0;
        cb(true);
    };
};

var _moveUp = function (cb) {
    setTimeout(function () {
        console.log("Move Up");
        controller.forward(1, motorCallback);
        cb(true);
    }, controller.sequenceParams.moveUpDelay);
    /*console.log("Move Up");
    controller.forward(1, function () {
        setTimeout(function () {
            console.log("wait after move up");
            cb(true);
        }, 10000);
    });*/
};

var _moveNeck = function (cb) {
    setTimeout(function () {
        console.log("Move neck left");
        controller.forward(2, motorCallback);
    }, controller.sequenceParams.moveNeckLeftDelay);
    setTimeout(function () {
        console.log("wait after neck left");
    }, controller.sequenceParams.moveNeckLeftWait);
    setTimeout(function () {
        console.log("Move neck right");
        controller.backward(2, motorCallback);
    }, controller.sequenceParams.moveNeckRightDelay);
    setTimeout(function () {
        cb(true);
        console.log("wait after neck right");
    }, controller.sequenceParams.moveNeckRightWait);
    /*console.log("Move neck left");
    controller.forward(2, function () {
        console.log("wait after neck left");
        setTimeout(function () {
            console.log("Move neck right");
            controller.backward(2, function () {
                setTimeout(function () {
                    console.log("wait after neck right");
                    cb(true);
                }, 15000);
            });
        }, 10000);
    });*/

};

var _moveDown = function (cb) {
    setTimeout(function () {
        console.log("Move down");
        controller.backward(1, motorCallback);
        cb(true);
    }, controller.sequenceParams.moveDownDelay);

    /* console.log("Move down");
     controller.backward(1, function () {
         cb(true);
     });*/
};

var motorCallback = function () {
    console.log("cb");
};

var _sleep = function (x) {
    return function (cb) {
        setTimeout(cb, x)
    }
}

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

