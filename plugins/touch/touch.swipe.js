'use strict';

/*
 * 注册swipe事件
 * */
(function (at, name) {
    var handle = function (event, touch) {
        var session = at.gestures.session;
        if (event.type === at.EVENT_END || event.type === at.EVENT_CANCEL) {
            var options = this.options;
            touch.swipe = false;
            // TODO 后续根据velocity计算
            if (touch.direction && options.swipeMaxTime > touch.deltaTime && touch.distance > options.swipeMinDistince) {
                touch.swipe = true;
                at.trigger(session.target, name, touch);
                at.trigger(session.target, name + touch.direction, touch);
            }
        }
    };
    at.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            swipeMaxTime: 300,
            swipeMinDistince: 18
        }
    });
})(at, 'swipe');
