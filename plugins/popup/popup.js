'use strict';

/*
 * popup逻辑代码
 * */
(function (win, doc) {
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

    var aPopups = document.querySelectorAll('[data-popup]');
    var popupStatus = {};

    if (!util.isEmpty(aPopups)) {
        util.each(aPopups, function (i, e) {
            e.addEventListener('touchstart', function () {
                if (typeof popupStatus[this.dataset.popup] == 'undefined' || !popupStatus[this.dataset.popup]) {
                    popupStatus[this.dataset.popup] = true;
                    var openPop = document.querySelector(this.dataset.popup);
                    openPop && openPop.classList.add('ue-active');
                } else {
                    popupStatus[this.dataset.popup] = false;
                    var closePop = document.querySelector(this.dataset.popup);
                    closePop && closePop.classList.remove('ue-active');
                }
            }, false);
        })
    }
})(window, document);
