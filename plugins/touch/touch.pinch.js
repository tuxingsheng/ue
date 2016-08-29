'use strict';

/*
 * 注册pinch事件
 * */
(function (at, name) {
    var handle = function (event, touch) {
        var options = this.options;
        var session = at.gestures.session;
        switch (event.type) {
            case at.EVENT_START:
                break;
            case at.EVENT_MOVE:
                if (at.gestureConfig.pinch) {
                    if (touch.touches.length < 2) {
                        return;
                    }
                    if (!session.pinch) { //start
                        session.pinch = true;
                        at.trigger(session.target, name + 'start', touch);
                    }
                    at.trigger(session.target, name, touch);
                    var scale = touch.scale;
                    var rotation = touch.rotation;
                    var lastScale = typeof touch.lastScale === 'undefined' ? 1 : touch.lastScale;
                    var scaleDiff = 0.000000000001; //防止scale与lastScale相等，不触发事件的情况。
                    if (scale > lastScale) { //out
                        lastScale = scale - scaleDiff;
                        at.trigger(session.target, name + 'out', touch);
                    } //in
                    else if (scale < lastScale) {
                        lastScale = scale + scaleDiff;
                        at.trigger(session.target, name + 'in', touch);
                    }
                    if (Math.abs(rotation) > options.minRotationAngle) {
                        at.trigger(session.target, 'rotate', touch);
                    }
                }
                break;
            case at.EVENT_END:
            case at.EVENT_CANCEL:
                if (at.gestureConfig.pinch && session.pinch && touch.touches.length === 2) {
                    session.pinch = false;
                    at.trigger(session.target, name + 'end', touch);
                }
                break;
        }
    };
    at.addGesture({
        name: name,
        index: 10,
        handle: handle,
        options: {
            minRotationAngle: 0
        }
    });
})(at, 'pinch');
