'use strict';

/*
 * 注册hold事件
 * */
(function (at, name) {
    var timer;
    var handle = function (event, touch) {
        var session = at.gestures.session;
        var options = this.options;
        switch (event.type) {
            case at.EVENT_START:
                if (at.gestureConfig.hold) {
                    timer && clearTimeout(timer);
                    timer = setTimeout(function () {
                        touch.hold = true;
                        at.trigger(session.target, name, touch);
                    }, options.holdTimeout);
                }
                break;
            case at.EVENT_MOVE:
                break;
            case at.EVENT_END:
            case at.EVENT_CANCEL:
                if (timer) {
                    clearTimeout(timer) && (timer = null);
                    at.trigger(session.target, 'release', touch);
                }
                break;
        }
    };
    /**
     * mui gesture hold
     */
    at.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            fingers: 1,
            holdTimeout: 0
        }
    });
})(at, 'hold');
