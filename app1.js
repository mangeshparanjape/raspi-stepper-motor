var path = require('path'); var stepperWiringpi= require 
('stepper-wiringpi'); var sp = require('stream-player'); var p = new 
sp(); 
p.add('/home/stepper-ctrl/raspi-stepper-motor/sound/DrumMachine.mp3'); 
//p.play();

p.on('play start',function(){
console.log('started');
});

p.on('play end',function(){
console.log('end');
});


var motor = stepperWiringpi.setup(200,23,24);
motor.setSpeed(60);

var fwd = function () {
motor.step(100, function(){
stopMusic();
});
};

var bcw = function () {
motor.step(-100, function (){
stopMusic();
});
};

var playMusic = function () {
p.play();
};

var stopMusic = function (){
p.pause();
};

playMusic();
fwd();
bcw();
playMusic();

//motor.step(100, function(){
//console.log("step complete");
//	p.pause();
//});
//p.play();
