'use strict';

/*
 * 注册longtap事件
 * */
(function (at, name) {
    var timer;
    var handle = function (event, touch) {
        var session = at.gestures.session;
        var options = this.options;
        switch (event.type) {
            case at.EVENT_START:
                clearTimeout(timer);
                timer = setTimeout(function () {
                    at.trigger(session.target, name, touch);
                }, options.holdTimeout);
                break;
            case at.EVENT_MOVE:
                if (touch.distance > options.holdThreshold) {
                    clearTimeout(timer);
                }
                break;
            case at.EVENT_END:
            case at.EVENT_CANCEL:
                clearTimeout(timer);
                break;
        }
    };
    at.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            fingers: 1,
            holdTimeout: 500,
            holdThreshold: 2
        }
    });
})(at, 'longtap');
