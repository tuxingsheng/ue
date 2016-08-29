'use strict';

/*
 * 注册drag事件
 * */
(function (at, name) {
    var handle = function (event, touch) {
        var session = at.gestures.session;
        switch (event.type) {
            case at.EVENT_START:
                break;
            case at.EVENT_MOVE:
                if (!touch.direction || !session.target) {
                    return;
                }
                //修正direction,可在session期间自行锁定拖拽方向，方便开发scroll类不同方向拖拽插件嵌套
                if (session.lockDirection && session.startDirection) {
                    if (session.startDirection && session.startDirection !== touch.direction) {
                        if (session.startDirection === 'up' || session.startDirection === 'down') {
                            touch.direction = touch.deltaY < 0 ? 'up' : 'down';
                        } else {
                            touch.direction = touch.deltaX < 0 ? 'left' : 'right';
                        }
                    }
                }

                if (!session.drag) {
                    session.drag = true;
                    at.trigger(session.target, name + 'start', touch);
                }
                at.trigger(session.target, name, touch);
                at.trigger(session.target, name + touch.direction, touch);
                break;
            case at.EVENT_END:
            case at.EVENT_CANCEL:
                if (session.drag && touch.isFinal) {
                    at.trigger(session.target, name + 'end', touch);
                }
                break;
        }
    };
    at.addGesture({
        name: name,
        index: 20,
        handle: handle,
        options: {
            fingers: 1
        }
    });
})(at, 'drag');
