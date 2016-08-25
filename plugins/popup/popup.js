'use strict';

/*
 * popup逻辑代码
 * */
(function (win, doc) {

    /*
     * 工具方法
     * */
    var util = {
        /*
         * @name isArray
         * @type function
         * @explain 验证是否是数组
         * */
        isArray: function (obj) {
            return obj && typeof obj === 'object' && obj.constructor == Array;
        },
        /*
         * @name isString
         * @type function
         * @explain 验证是否是一个字符串
         * */
        isString: function (obj) {
            return obj && typeof obj === 'string' && obj.constructor == String;
        },
        /*
         * @name hasOwn
         * @type function
         * @explain 验证该属性是否属于某个对象
         * */
        hasOwn: function (obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        },
        /*
         * @name isObject
         * @type function
         * @explain 验证是否是一个对象
         * */
        isObject: function (obj) {
            return obj !== null && typeof obj === 'object';
        },
        /*
         * @name isEmpty
         * @type function
         * @explain 是否为空，支持检测数组、对象和字符串
         * */
        isEmpty: function (obj) {
            if (obj == null) return true;
            if (util.isArray(obj) || util.isString(obj)) return obj.length === 0;
            for (var key in obj) if (util.hasOwn(obj, key)) return false;
            return true;
        },
        /*
         * @name extend
         * @type function
         * @explain 复制对象
         * */
        extend: function (to, from) {
            var keys = Object.keys(from);
            var i = keys.length;
            while (i--) {
                to[keys[i]] = from[keys[i]];
            }
            return to;
        },
        /*
         * @name each
         * @type function
         * @explain each循环
         * */
        each: function (obj, fn) {
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
        }
    };

    function Popup() {

        // 状态系统
        this.popupStatus = {};
        // popup对象
        this.popupList = [];

        this.init();
    }

    /*
     * 初始化
     * */
    Popup.prototype.init = function () {
        var self = this,
            aP = document.querySelectorAll('[data-popup]');

        if (!util.isEmpty(aP)) {
            util.each(aP, function (i, e) {
                self.popupList.push(e);
                self.bindEvent(e);
            })
        }
    };

    /*
     * js打开popup
     * */
    Popup.prototype.open = function (popupId, trigger) {
        var pop = document.querySelector(popupId);

        if (pop) {
            trigger = util.isString(trigger) ? document.querySelector(trigger) : trigger;
            trigger.setAttribute('data-popup', popupId);
            this.popupList.push(pop);
            this.popover(trigger);
        }
    };

    /*
     * 绑定触发事件
     * */
    Popup.prototype.bindEvent = function (pop) {
        pop.addEventListener('touchstart', function () {
            this.popover(pop);
        }.bind(this), false);
    };

    /*
     * 判断关闭 or 开启
     * */
    Popup.prototype.popover = function (pop) {
        if (typeof this.popupStatus[pop.dataset.popup] == 'undefined' || !this.popupStatus[pop.dataset.popup]) {
            this.popupStatus[pop.dataset.popup] = true;
            var openPop = document.querySelector(pop.dataset.popup);
            openPop && openPop.classList.add('ue-active');
        } else {
            this.popupStatus[pop.dataset.popup] = false;
            var closePop = document.querySelector(pop.dataset.popup);
            closePop && closePop.classList.remove('ue-active');
        }
    };


    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(Popup);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = new Popup();
    } else {
        win.popup = new Popup();
    }
})(window, document);
