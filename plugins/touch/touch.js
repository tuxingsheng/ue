'use strict';

/*
 * fixed CustomEvent
 * */
(function (window) {
    if (typeof window.CustomEvent === 'undefined') {
        function CustomEvent(event, params) {
            params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
            var evt = document.createEvent('Events'), bubbles = true, n;
            for (n in params) {
                (n === 'bubbles') ? (bubbles = !!params[n]) : (evt[n] = params[n]);
            }
            evt.initEvent(event, bubbles, true);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }
})(window);


/*
 *分类	    参数	        描述
 *点击	    tap	        单击屏幕
 *          doubletap	双击屏幕
 *长按	    longtap	    长按屏幕
 *          hold	    按住屏幕
 *          release	    离开屏幕
 *滑动	    swipeleft	向左滑动
 *          swiperight	向右滑动
 *          swipeup	    向上滑动
 *          swipedown	向下滑动
 *拖动	    dragstart	开始拖动
 *          drag	    拖动中
 *          dragend	    拖动结束
 * */
(function (window, document) {
    var at = {};
    at.gestures = {
        session: {},
        hooks: {}
    };
    /*
     * gesture配置
     * */
    at.gestureConfig = {
        tap: true,
        doubletap: true,
        longtap: true,
        hold: true,
        flick: true,
        swipe: true,
        drag: true,
        pinch: true
    };
    /*
     * slice
     * */
    at.slice = [].slice;
    /*
     * 时间戳
     * */
    at.now = function () {
        return +new Date();
    };
    /*
     * 遍历方法
     * */
    at.each = function (obj, fn) {
        if (obj) {
            var i = 0;
            if (obj.length) {
                for (var n = obj.length; i < n; i++) {
                    if (fn(i, obj[i]) === false)
                        break
                }
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                        break
                    }
                }
            }
        }
    };
    /*
     * trigger event
     * */
    at.trigger = function (element, eventType, eventData) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
    };
    /*
     * 注册gesture(手势)
     * */
    at.addGesture = function (gesture) {
        return at.addAction('gestures', gesture);
    };
    /*
     * 执行手势的hooks方法
     * */
    at.doAction = function (type, callback) {
        if (typeof callback == 'function') {
            // 指定了callback
            at.each(at.gestures.hooks[type], callback);
        } else {
            //未指定callback，直接执行
            at.each(at.gestures.hooks[type], function (index, hook) {
                return !hook.handle();
            });
        }
    };
    at.detect = function (event, touch) {
        if (at.gestures.stoped) {
            return;
        }
        at.doAction('gestures', function (index, gesture) {
            if (!at.gestures.stoped) {
                if (at.gestureConfig[gesture.name] !== false) {
                    gesture.handle(event, touch);
                }
            }
        });
    };
    at.addAction = function (type, hook) {
        var hooks = at.gestures.hooks[type];
        if (!hooks) {
            hooks = [];
        }
        hook.index = hook.index || 1000;
        hooks.push(hook);
        hooks.sort(function (a, b) {
            return a.index - b.index;
        });
        at.gestures.hooks[type] = hooks;
        return at.gestures.hooks[type];
    };

    at.isTouchable = 'ontouchstart' in window;
    at.EVENT_CANCEL = 'touchcancel';
    at.EVENT_START = at.isTouchable ? 'touchstart' : 'mousedown';
    at.EVENT_MOVE = at.isTouchable ? 'touchmove' : 'mousemove';
    at.EVENT_END = at.isTouchable ? 'touchend' : 'mouseup';

    var round = Math.round,
        atan2 = Math.atan2,
        abs = Math.abs,
        sqrt = Math.sqrt,
        CAL_INTERVAL = 25,
        targetIds = {};

    var convertTouches = function (touches) {
        for (var i = 0; i < touches.length; i++) {
            !touches['identifier'] && (touches['identifier'] = 0);
        }
        return touches;
    };

    var uniqueArray = function (src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;

        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (values.indexOf(val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key];
                });
            }
        }

        return results;
    };

    var hasParent = function(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };

    var getTouches = function (event, touch) {
        var allTouches = convertTouches(at.slice.call(event.touches || [event]));

        var type = event.type;

        var targetTouches = [];
        var changedTargetTouches = [];

        //当touchstart或touchmove且touches长度为1，直接获得all和changed
        if ((type === at.EVENT_START || type === at.EVENT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            targetTouches = allTouches;
            changedTargetTouches = allTouches;
            touch.target = event.target;
        } else {
            var i = 0;
            var targetTouches = [];
            var changedTargetTouches = [];
            var changedTouches = convertTouches(at.slice.call(event.changedTouches || [event]));

            touch.target = event.target;
            var sessionTarget = at.gestures.session.target || event.target;
            targetTouches = allTouches.filter(function (touch) {
                return hasParent(touch.target, sessionTarget);
            });

            if (type === at.EVENT_START) {
                i = 0;
                while (i < targetTouches.length) {
                    targetIds[targetTouches[i].identifier] = true;
                    i++;
                }
            }

            i = 0;
            while (i < changedTouches.length) {
                if (targetIds[changedTouches[i].identifier]) {
                    changedTargetTouches.push(changedTouches[i]);
                }
                if (type === at.EVENT_END || type === at.EVENT_CANCEL) {
                    delete targetIds[changedTouches[i].identifier];
                }
                i++;
            }

            if (!changedTargetTouches.length) {
                return false;
            }
        }
        targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
        var touchesLength = targetTouches.length;
        var changedTouchesLength = changedTargetTouches.length;
        if (type === at.EVENT_START && touchesLength - changedTouchesLength === 0) { //first
            touch.isFirst = true;
            at.gestures.touch = at.gestures.session = {
                target: event.target
            };
        }
        touch.isFinal = ((type === at.EVENT_END || type === at.EVENT_CANCEL) && (touchesLength - changedTouchesLength === 0));

        touch.touches = targetTouches;
        touch.changedTouches = changedTargetTouches;
        return true;

    };

    var getVelocity = function (deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    };

    var getDistance = function (p1, p2, props) {
        if (!props) {
            props = ['x', 'y'];
        }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return sqrt((x * x) + (y * y));
    };

    var getDirection = function (x, y) {
        if (x === y) {
            return '';
        }
        if (abs(x) >= abs(y)) {
            return x > 0 ? 'left' : 'right';
        }
        return y > 0 ? 'up' : 'down';
    };

    var calIntervalTouchData = function (touch) {
        var session = at.gestures.session;
        var last = session.lastInterval || touch;
        var deltaTime = touch.timestamp - last.timestamp;
        var velocity;
        var velocityX;
        var velocityY;
        var direction;

        if (touch.gesture.type != at.EVENT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
            var deltaX = last.deltaX - touch.deltaX;
            var deltaY = last.deltaY - touch.deltaY;

            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY) || last.direction;

            session.lastInterval = touch;
        } else {
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        touch.velocity = velocity;
        touch.velocityX = velocityX;
        touch.velocityY = velocityY;
        touch.direction = direction;
    };

    var calDelta = function (touch) {
        var session = at.gestures.session;
        var center = touch.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevTouch = session.prevTouch || {};

        if (touch.gesture.type === at.EVENT_START || touch.gesture.type === at.EVENT_END) {
            prevDelta = session.prevDelta = {
                x: prevTouch.deltaX || 0,
                y: prevTouch.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }
        touch.deltaX = prevDelta.x + (center.x - offset.x);
        touch.deltaY = prevDelta.y + (center.y - offset.y);
    };

    var getMultiCenter = function (touches) {
        var touchesLength = touches.length;
        if (touchesLength === 1) {
            return {
                x: round(touches[0].pageX),
                y: round(touches[0].pageY)
            };
        }

        var x = 0;
        var y = 0;
        var i = 0;
        while (i < touchesLength) {
            x += touches[i].pageX;
            y += touches[i].pageY;
            i++;
        }

        return {
            x: round(x / touchesLength),
            y: round(y / touchesLength)
        };
    };

    var copySimpleTouchData = function (touch) {
        var touches = [];
        var i = 0;
        while (i < touch.touches.length) {
            touches[i] = {
                pageX: round(touch.touches[i].pageX),
                pageY: round(touch.touches[i].pageY)
            };
            i++;
        }
        return {
            timestamp: at.now(),
            gesture: touch.gesture,
            touches: touches,
            center: getMultiCenter(touch.touches),
            deltaX: touch.deltaX,
            deltaY: touch.deltaY
        };
    };

    var multiTouch = function () {
        return at.gestureConfig.pinch;
    };

    var getAngle = function (p1, p2, props) {
        if (!props) {
            props = ['x', 'y'];
        }
        var x = p2[props[0]] - p1[props[0]];
        var y = p2[props[1]] - p1[props[1]];
        return atan2(y, x) * 180 / Math.PI;
    };

    var calTouchData = function (touch) {
        var session = at.gestures.session;
        var touches = touch.touches;
        var touchesLength = touches.length;

        if (!session.firstTouch) {
            session.firstTouch = copySimpleTouchData(touch);
        }

        if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
            session.firstMultiTouch = copySimpleTouchData(touch);
        } else if (touchesLength === 1) {
            session.firstMultiTouch = false;
        }

        var firstTouch = session.firstTouch;
        var firstMultiTouch = session.firstMultiTouch;
        var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

        var center = touch.center = getMultiCenter(touches);
        touch.timestamp = at.now();
        touch.deltaTime = touch.timestamp - firstTouch.timestamp;

        touch.angle = getAngle(offsetCenter, center);
        touch.distance = getDistance(offsetCenter, center);

        calDelta(touch);

        touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

        touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
        touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

        calIntervalTouchData(touch);

    };

    var handleTouchEvent = function (event) {
        var touch = {
            gesture: event
        };
        var touches = getTouches(event, touch);
        if (!touches) {
            return;
        }
        calTouchData(touch);
        at.detect(event, touch);
        at.gestures.session.prevTouch = touch;
        if (event.type === at.EVENT_END && !at.isTouchable) {
            at.gestures.touch = at.gestures.session = {};
        }
    };

    window.addEventListener(at.EVENT_START, handleTouchEvent);
    window.addEventListener(at.EVENT_MOVE, handleTouchEvent);
    window.addEventListener(at.EVENT_END, handleTouchEvent);
    window.addEventListener(at.EVENT_CANCEL, handleTouchEvent);

    if (typeof exports === 'object') module.exports = at;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return at;
    });
    else window.at = at;
})(window, document);
