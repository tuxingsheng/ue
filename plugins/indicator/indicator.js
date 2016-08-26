'use strict';

/*
 * 原生js加载指示器，适用于手机端
 * @author          涂兴声
 * @createDate      2016/08/26
 * 名称	            内容
 * spinnerType      加载器类型（多种加载器可选择）
 * spinnerText      加载器文本内容
 * spinnerTextClose 是否隐藏加载器文本内容
 * spinnerBgColor   设置加载器背景色
 * */
!(function (indicator) {
    'use strict';
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(Preload);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = indicator();
    } else {
        window.indicator = indicator();
    }
})(function () {
    'use strict';

    function Indicator() {

        /*
         * 工具方法
         * */
        this.util = {
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
                if (this.util.isArray(obj) || this.util.isString(obj)) return obj.length === 0;
                for (var key in obj) if (this.util.hasOwn(obj, key)) return false;
                return true;
            }.bind(this),
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


        this.spinnerInit = true;
        this.spinner = 'snake';

        /*
         * spinner模板
         * */
        this.template = {
            'snake': '<div class="ue-spinner-snake"></div>',
            'circle': '<div class="ue-spinner-circle">\
                         <div class="ue-spinner-circle-cell circle-1"></div>\
                         <div class="ue-spinner-circle-cell circle-2"></div> \
                         <div class="ue-spinner-circle-cell circle-3"></div>\
                         <div class="ue-spinner-circle-cell circle-4"></div>\
                         <div class="ue-spinner-circle-cell circle-5"></div>\
                         <div class="ue-spinner-circle-cell circle-6"></div>\
                         <div class="ue-spinner-circle-cell circle-7"></div>\
                         <div class="ue-spinner-circle-cell circle-8"></div>\
                         <div class="ue-spinner-circle-cell circle-9"></div>\
                         <div class="ue-spinner-circle-cell circle-10"></div>\
                         <div class="ue-spinner-circle-cell circle-11"></div>\
                         <div class="ue-spinner-circle-cell circle-12"></div>\
                     </div>'
        };
    }

    /*
     * 初始化
     * */
    Indicator.prototype.create = function () {
        this.ueIndicator = document.createElement('div');
        this.ueIndicator.className = 'ue-indicator';
        this.ueIndicator.innerHTML = '<div class="ue-indicator-mask"></div>\
                                         <div class="ue-indicator-wrapper">\
                                            <div class="ue-indicator-spin"></div>\
                                         <div class="ue-indicator-text"></div>\
                                      </div>';
        document.body.appendChild(this.ueIndicator);
        this.fill();
    };

    /*
     * 设置Indicator
     * */
    Indicator.prototype.fill = function () {
        this.ueIndicator.querySelector('.ue-indicator-mask').style.backgroundColor = this.defaults.spinnerBgColor;
        this.ueIndicator.querySelector('.ue-indicator-spin').innerHTML = this.template[this.defaults.spinnerType];
        this.ueIndicator.querySelector('.ue-indicator-text').innerText = this.defaults.spinnerText;
        this.ueIndicator.querySelector('.ue-indicator-text').style.display = this.defaults.spinnerTextClose ? 'none' : 'block';
        this.show();
    };

    /*
     * 打开Indicator
     * */
    Indicator.prototype.open = function (options) {
        this.defaults = {
            spinnerType: 'snake',
            spinnerText: '加载中...',
            spinnerTextClose: true,
            spinnerBgColor: 'transparent'
        };

        // 自定义配置是否存在
        if (!this.util.isEmpty(options)) {
            // 配置是否是对象
            if (!this.util.isObject(options)) {
                throw Error('Indicator参数必须是一个对象');
            }
            this.defaults = this.util.extend(this.defaults, options);
        }

        if (this.spinnerInit) {
            this.spinnerInit = false;
            this.create();
        } else {
            this.fill();
        }
    };

    /*
     * 显示Indicator
     * */
    Indicator.prototype.show = function () {
        this.ueIndicator.classList.add('ue-active');
    };

    /*
     * 关闭Indicator
     * */
    Indicator.prototype.close = function () {
        this.ueIndicator.classList.remove('ue-active');
    };

    return new Indicator();
});
