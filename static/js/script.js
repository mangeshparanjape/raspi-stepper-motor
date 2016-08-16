$(function () {
    var socket = io.connect(), //we connect by using a websocket
        ui = {
            forward: $('.btn-forward'),
            backward: $('.btn-backward'),
            initMotor: $('.btn-init'),
            all: $('.btn')
        },
        params = {},
        activeClass = 'is-active',
        isPressed = false;

    //we listen to key pressing
    $('.btn-init').click(function(e) {
        $(this).addClass(activeClass);
        params.rpm= $('#rpm')[0].value;
        params.pin1= $('#pin1')[0].value;
        params.pin2= $('#pin2')[0].value;
        params.speed= $('#speed')[0].value;
        params.steps= $('#steps')[0].value;
        params.clip= $('#clip')[0].value;
        params.direction= $('#direction')[0].value;
        console.log(params);
        
        socket.emit('init', params, function(){
            console.log("done");
        });
               
    });
    $(document).keydown(function (e) {
        //ignores other keys pressed if a key is already pressed
        //we do this in order to avoid sending out several commands
        //when we keep the key pressed
        if (isPressed) return;

        isPressed = true;
        switch (e.which) {
            case 38: //code for the key w
                socket.emit('move', 'forward');
                ui.forward.addClass(activeClass);
                break;
            case 40: //code for the key a
                socket.emit('move', 'backward');
                ui.backward.addClass(activeClass);
                break;
        }
    });

    //stops the motors when a key is released
    $(document).keyup(function (e) {
        ui.all.removeClass(activeClass);
        socket.emit('stop');
        isPressed = false;
    });
    
});
