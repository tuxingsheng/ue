'use strict';

/*
 * @name slider.js
 * @explain 轮播图组件，依赖ue.js
 * */
(function (win, doc) {
    function Slider(options) {
        if (!win.IScroll) {
            throw Error('请先引入ue核心js');
        }

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

        /*
         * Slider默认配置
         * @param {String} el 轮播区域
         * @param {Number} snapSpeed 动画速度
         * @param {Boolea} auto 是否自动轮播
         * @param {Number} duration 自动轮播时间间隔
         * */
        this.defaults = {
            el: '#slider',
            auto: true,
            duration: 2000,
            snapSpeed: 1000
        };

        this.timer = this.container = null;
        this.len = this.x = 0;

        /*
         * 初始化
         * */
        this.init = function () {
            // 自定义配置是否存在
            if (!this.util.isEmpty(options)) {
                // 配置是否是对象
                if (!this.util.isObject(options)) {
                    console.warn('Slider config must be an object');
                }
                this.defaults = this.util.extend(this.defaults, options);
            }

            this.total();

            this.container = new IScroll(this.defaults.el, {
                snap: true,
                scrollX: true,
                scrollY: false,
                momentum: false,
                keyBindings: true,
                snapSpeed: this.defaults.snapSpeed
            });

            if (this.defaults.auto) {
                this.autoPlay();
            }

            this.container.on('scrollEnd', function () {
                if (this.defaults.auto) {
                    this.autoPlay();
                }
            }.bind(this));

            /*
             * 旋转重新计算宽度
             * */
            win.addEventListener('orientationchange', function () {
                this.initSetWidth();
            }.bind(this), false);
        };

        /*
         * 自动轮播
         * */
        this.autoPlay = function () {
            this.x = this.container.currentPage.pageX;
            this.dotty(this.x);
            clearInterval(this.timer);
            this.timer = setInterval(function () {
                var count = this.count();
                this.dotty(count);
                this.container.goToPage(count, 0);
            }.bind(this), this.defaults.duration)
        };

        /*
         * 获取轮播图的数量
         * */
        this.total = function () {
            var el = doc.querySelector(this.defaults.el);
            this.len = el.querySelectorAll('.ue-slider-body').length;
            this.initSetWidth();
            this.createDotty();
        };

        /*
         * 计数器
         * */
        this.count = function () {
            this.x++;
            if (this.x > this.len - 1) {
                this.x = 0;
            }
            return this.x;
        };

        /*
         * 初始化动态计算宽度
         * */
        this.initSetWidth = function () {
            var w = doc.documentElement.getBoundingClientRect().width;
            doc.querySelector('.ue-slider').style.width = w * this.len + 'px';
            var sliderBodys = doc.querySelectorAll('.ue-slider-body');
            this.util.each(sliderBodys, function (i, e) {
                e.style.width = w + 'px';
            });
        };

        /*
         * 动态创建dotty
         * */
        this.createDotty = function () {
            var dom = '', i = 0;
            for (; i < this.len; i++) {
                dom += '<div></div>';
            }
            doc.querySelector('.ue-slider-indicator').innerHTML = dom;
        };

        /*
         * 动态修改dotty状态
         * */
        this.dotty = function (n) {
            var indicators = doc.querySelectorAll('.ue-slider-indicator > div');
            this.util.each(indicators, function (i, e) {
                e.removeAttribute('class');
            });
            if (indicators[n]) {
                indicators[n].setAttribute('class', 'ue-active');
            }
        };

        this.init();
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = Slider;
    } else if (typeof define == 'function' && define.amd) {
        define(function () {
            return Slider;
        });
    } else {
        win.Slider = Slider;
    }
})(window, document);
