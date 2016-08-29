'use strict';

/*
 * 注册flick事件
 * */
(function (at, name) {
    var flickStartTime = 0;
    var handle = function (event, touch) {
        var session = at.gestures.session;
        var options = this.options;
        var now = at.now();
        switch (event.type) {
            case at.EVENT_MOVE:
                if (now - flickStartTime > 300) {
                    flickStartTime = now;
                    session.flickStart = touch.center;
                }
                break;
            case at.EVENT_END:
            case at.EVENT_CANCEL:
                touch.flick = false;
                if (session.flickStart && options.flickMaxTime > (now - flickStartTime) && touch.distance > options.flickMinDistince) {
                    touch.flick = true;
                    touch.flickTime = now - flickStartTime;
                    touch.flickDistanceX = touch.center.x - session.flickStart.x;
                    touch.flickDistanceY = touch.center.y - session.flickStart.y;
                    at.trigger(session.target, name, touch);
                    at.trigger(session.target, name + touch.direction, touch);
                }
                break;
        }

    };
    at.addGesture({
        name: name,
        index: 5,
        handle: handle,
        options: {
            flickMaxTime: 200,
            flickMinDistince: 10
        }
    });
})(at, 'flick');
