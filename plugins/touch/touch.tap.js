'use strict';

/*
 * 注册tap事件
 * */
(function (at, name) {
    var lastTarget;
    var lastTapTime;
    var handle = function (event, touch) {
        var session = at.gestures.session;
        var options = this.options;
        switch (event.type) {
            case at.EVENT_END:
                if (!touch.isFinal) {
                    return;
                }
                var target = session.target;
                if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
                    if (at.gestureConfig.doubletap && lastTarget && (lastTarget === target)) { //same target
                        if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
                            at.trigger(target, 'doubletap', touch);
                            lastTapTime = at.now();
                            lastTarget = target;
                            return;
                        }
                    }
                    at.trigger(target, name, touch);
                    lastTapTime = at.now();
                    lastTarget = target;
                }
                break;
        }
    };
    at.addGesture({
        name: name,
        index: 30,
        handle: handle,
        options: {
            fingers: 1,
            tapMaxInterval: 300,
            tapMaxDistance: 5,
            tapMaxTime: 250
        }
    });

})(at, 'tap');
